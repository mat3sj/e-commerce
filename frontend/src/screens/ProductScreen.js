import React from "react"
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Card} from 'react-bootstrap'
import Rating from '../components/Rating'
import products from '../products'


function ProductScreen(match) {
    // console.log(match) //todo delete this
    const product = products.find(p => p._id == match.match.params.id)
    // const product = products.find()


    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            <Row>
                <Col md={6}>
                    <Image src={product.image} alt={product.name} fluid/>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Rating value={product.rating}
                                    no_reviews={product.numReviews}
                                    color={'#f8e825'}/>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Price: ${product.price}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Description: {product.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col><strong>${product.price}</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col><strong>{product.countInStock > 0 ? 'In stock' : 'Out of stock'}</strong></Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button className='btn-block' disabled={product.countInStock==0} type='button'>Add to Card</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProductScreen