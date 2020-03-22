
  
  const getTableData = (req, res, db) => {
    db.select('*').from('repair')
      .modify(function(queryBuilder){
        if (Object.keys(req.query).length > 0) {
          const keys = Object.keys(req.query)
          const k = keys[0]
          const re = /(?<left>\w+\s?<|>\s?)/ //<--- regex that identifies 'price<' type of pattern caused by gte; and lte; signs
          const result = re.exec(k)
          if(result && req.query[k]){
            const left = k.slice(0,-1)
            const operator = k.charAt(k.length-1) + '='
            const right = req.query[k]
            queryBuilder.where(left, operator, right)
          } else {
            const reDate = /(?<left>\w+\s?)(?<operator>>|<|\s?)(?<right>\s?\d{4}-\d{2}-\d{2})/
            const resultDate = reDate.exec(k)
            const re2 = /(?<left>\w+\s?)(?<operator>>|<|\s?)(?<right>\s?\d+.?\d{2}?)/ //<--- regex that matches gt; and lt; signs
            const result2 = re2.exec(k)
            const re3 = /(?<left>\w+\s)(?<operator>contains)(?<right>.*)/ //<--- regex for contains operator
            const result3 = re3.exec(k)
            if (resultDate){
              queryBuilder.where(resultDate.groups.left, resultDate.groups.operator.trim(), resultDate.groups.right)
            } else if(result2){
              queryBuilder.where(result2.groups.left, result2.groups.operator.trim(), result2.groups.right)
            } else if(result3){
              queryBuilder.where(result3.groups.left, 'ilike', `%${result3.groups.right.trim()}%`)
            }else {   //<--- default when query param is used with '=', e.g. 'price=0'
              const val = req.query[k]
              queryBuilder.where(k, val.trim());
            }
          }
        } 
      }).then(items => {
          if(items.length){
            console.log(`found ${items.length} items`)
            res.json(items)
          } else {
            res.json({dataExists: 'false'})
         }
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }

  const queryById = (req, res, db) => {
    id = req.params.id
    db.select('*').from('repair').where({id:id})
      .then(items => {
        if(items.length){
          console.log(`found ${items.length} items`)
          res.json(items)
        } else {
          res.json({dataExists: 'false'})
        }
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const postTableData = (req, res, db) => {
    const { description, price, date } = req.body
    db('repair').insert({description, price, date})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const putTableData = (req, res, db) => {
    const { id, description, price, date } = req.body
    db('repair').where({id}).update({description, price, date})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const deleteTableData = (req, res, db) => {
    const { id } = req.body
    db('repair').where({id}).del()
      .then(() => {
        res.json({delete: 'true'})
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  module.exports = {
    getTableData,
    postTableData,
    putTableData,
    deleteTableData,
    queryById
  }