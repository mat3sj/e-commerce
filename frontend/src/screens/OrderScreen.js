import React, {useState, useEffect} from "react";
import {
    Row,
    Col,
    Image,
    ListGroup, Card, Button
} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import Message from "../components/Message";
import {deliverOrder, getOrderDetails, payOrder} from "../actions/orderActions";
import {PayPalButton} from "react-paypal-button-v2";
import Loader from "../components/Loader";
import {
    ORDER_DELIVER_RESET,
    ORDER_PAY_RESET
} from "../constants/orderConstants";

function OrderScreen({match, history}) {
    const orderId = match.params.id
    const dispatch = useDispatch()

    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const {loading: loadingDeliver, success: successDeliver} = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin


    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }
    // AfK77P_lq_L-Jrhu_tQSmEcZQW8wn7fUHiid4w7dr76WOhcBgKzYVGz25mEbRoQ3M4wunPMWZVlnkuSW


    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = "https://www.paypal.com/sdk/js?client-id=AfK77P_lq_L-Jrhu_tQSmEcZQW8wn7fUHiid4w7dr76WOhcBgKzYVGz25mEbRoQ3M4wunPMWZVlnkuSW"
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)

    }

    useEffect(() => {
        if(!userInfo){
            history.push('/login')
        }
        if (!order || successPay || order.id !== Number(orderId) || successDeliver) {
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})

            dispatch(getOrderDetails(orderId))
        } else if (!order.is_paid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, order, orderId, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }
    const deliverHandler = () => {
        if (window.confirm('Are you sure you want to mark this order as delivered?')) {
            dispatch(deliverOrder(order))
        }
    }

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
                                    <Message variant='warning'>Not
                                        delivered</Message>

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
                                {order.is_paid ? (
                                    <Message variant='success'>Paid
                                        on {order.paid_at}</Message>
                                ) : (
                                    <Message variant='warning'>Not
                                        paid</Message>

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

                                {!order.is_paied && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader/>}
                                        {!sdkReady ? (
                                            <Loader/>
                                        ) : (
                                            <PayPalButton
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />
                                        )}
                                    </ListGroup.Item>
                                )}

                            </ListGroup>
                             {loadingPay && <Loader/>}
                            {userInfo && userInfo.is_admin && order.is_paid && !order.is_delivered && (
                                <ListGroup.Item>
                                    <Button
                                        type='button'
                                        className='btn btn-block'
                                        onClick={deliverHandler}
                                    >Mark as delivered</Button>
                                </ListGroup.Item>
                            )}
                        </Card>
                    </Col>

                </Row>

            </div>
        ))
}

export default OrderScreen



