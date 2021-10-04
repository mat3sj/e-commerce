import React, {useState, useEffect} from "react";
import {
    Form,
    Button,
    Row,
    Col,
    Image,
    ListGroup,
    ListGroupItem, Card
} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import Message from "../components/Message";
import {getOrderDetails} from "../actions/orderActions";
import {ORDER_CREATE_RESET} from "../constants/orderConstants";
import Loader from "../components/Loader";

function OrderScreen({match}) {
    const orderId = match.params.id
    const dispatch = useDispatch()


    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails


    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    useEffect(() => {
        if (!order || order.id !== Number(orderId)) {

            dispatch(getOrderDetails(orderId))
        }
    }, [order, orderId])

    return loading ? (
        <Loader/>
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        (
            <div>
                <h1>Order: {order.id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>
                                    Shipping
                                </h2>
                                <p><strong>Name: {order.user.name}</strong></p>
                                <p><strong>Email: {order.user.email}</strong>
                                </p>
                                <p>
                                    <strong>Shipping: </strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.city}
                                    {'   '}
                                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}

                                </p>
                                {order.is_delivered ? (
                                    <Message variant='success'>Delivered
                                        on {order.delivered_at}</Message>
                                ) : (
                                    <Message variant='warning'>Not delivered</Message>

                                )}

                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>
                                    Payment Method
                                </h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.payment_method}

                                </p>
                                {order.is_paied ? ( //todo fix to paid
                                    <Message variant='success'>Paid
                                        on {order.paid_at}</Message>
                                ) : (
                                    <Message variant='warning'>Not paid</Message>

                                )}

                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>
                                    Order Items
                                </h2>
                                {order.orderItems.length === 0 ?
                                    <Message variant='info'>
                                        Your cart is empty</Message> : (
                                        <ListGroup variant='flush'>
                                            {order.orderItems.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={1}>
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fluid rounded/>
                                                        </Col>
                                                        <Col>
                                                            <Link
                                                                to={`/product/${item.product}`}>{item.name}</Link>
                                                        </Col>
                                                        <Col md={4}>
                                                            {item.qty} x
                                                            ${item.price} =
                                                            ${(item.qty * item.price).toFixed(2)}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>)}

                            </ListGroup.Item>
                        </ListGroup>

                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Item:</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping:</Col>
                                        <Col>${order.shipping_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax:</Col>
                                        <Col>${order.tax_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total:</Col>
                                        <Col>${order.total_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>

                </Row>

            </div>
        ))
}

export default OrderScreen



