import React, {useState, useEffect} from "react"
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Card, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from "../components/Loader";
import Message from "../components/Message";
import {useDispatch, useSelector} from "react-redux";
import {listProductDetail} from "../actions/productActions";


function ProductScreen({match, history}) {
    // console.log(match) //todo delete this
    const [qty, setQty] = useState(1)

    const dispatch = useDispatch()
    const productDetail = useSelector(state => state.productDetail)
    const {loading, error, product} = productDetail
    useEffect(() => {
        dispatch((listProductDetail(match.params.id)))
    }, [dispatch, match.params.id])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }


    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            {loading ? <Loader/>
                : error ? <Message variant='danger'>{error}</Message>
                    :
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name}
                                   fluid/>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Rating value={product.rating}
                                            no_reviews={product.num_reviews}
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
                                            <Col><strong>{product.count_in_stock > 0 ? 'In stock' : 'Out of stock'}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.count_in_stock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty:</Col>
                                                <Col xs='auto' className="my-1">
                                                    <Form.Control
                                                        as="select"
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}>
                                                        {
                                                            [...Array(product.count_in_stock).keys()].map((x) => (
                                                                <option
                                                                    key={x + 1}
                                                                    value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Button
                                            onClick={addToCartHandler}
                                            className='btn-block'
                                            disabled={product.count_in_stock === 0}
                                            type='button'>Add to
                                            Card</Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>}
        </div>
    )
}

export default ProductScreen