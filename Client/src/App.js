import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import DataTable from './Components/Tables/DataTable'
import ModalForm from './Components/Modals/Modal'
import SearchForm from './Components/Forms/SearchForm'
import { CSVLink } from "react-csv"

class App extends Component {
  state = {
    items: []
  }

  getItems(){
    fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/crud`)
      .then(response => response.json())
      .then(items => this.setState({items}))
      .catch(err => console.log(err))
  }

  addItemToState = (item) => {
    this.setState(prevState => ({
      items: [...prevState.items, item]
    }))
  }

  updateState = (item) => {
    const itemIndex = this.state.items.findIndex(data => data.id === item.id)
    const newArray = [
    // destructure all items from beginning to the indexed item
      ...this.state.items.slice(0, itemIndex),
    // add the updated item to the array
      item,
    // add the rest of the items to the array from the index after the replaced item
      ...this.state.items.slice(itemIndex + 1)
    ]
    console.log(this.state.items)
    this.setState({ items: newArray })
  }

  filterState = (queryResults) => {
    this.setState({ items: queryResults })
  }

  deleteItemFromState = (id) => {
    const updatedItems = this.state.items.filter(item => item.id !== id)
    this.setState({ items: updatedItems })
  }

  componentDidMount(){
    this.getItems()
  }

  render() {
    return (
      <Container className="App">
        <Row>
          <Col>
            <h1 style={{margin: "20px 0"}}>Car Repairs</h1>
          </Col>
        </Row>
        <Row>
          <SearchForm items={this.state.items} filterState={this.filterState}/>
        </Row>
        <Row>
          <Col>
            <DataTable items={this.state.items} updateState={this.updateState} deleteItemFromState={this.deleteItemFromState} />
          </Col>
        </Row>
        <Row>
          <Col>
            <CSVLink
              filename={"db.csv"}
              color="primary"
              style={{float: "left", marginRight: "10px"}}
              className="btn btn-primary"
              data={this.state.items}>
              Download CSV
            </CSVLink>
            <ModalForm buttonLabel="Add Item" addItemToState={this.addItemToState}/>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App
