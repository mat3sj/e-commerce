import React, {useEffect} from "react";
import {Table, Button} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {listAllOrders} from "../actions/orderActions";

function OrderListScreen({history}) {

    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderListAll)
    const {loading, error, orders} = orderList

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin


    useEffect(() => {
        if (userInfo && userInfo.is_admin) {
            dispatch(listAllOrders())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, userInfo])


    return (
        <div>
            <h1>Orders</h1>
            {loading
                ? (<Loader/>)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive
                               className='table-sm'>
                            <thead>
                            <th>ID</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th>Details</th>
                            </thead>
                            <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.user && order.user.name}</td>
                                    <td>{order.created_at.substring(0, 10)}</td>
                                    <td>{order.total_price}</td>

                                    <td>{order.is_paid ? (
                                        order.paid_at.substring(0,10)
                                    ) : <i className='fas fa-times'
                                           style={{color: 'red'}}/>}</td>
                                    <td>{order.is_delivered ? (
                                        order.delivered_at.substring(0,10)
                                    ) : <i className='fas fa-times'
                                           style={{color: 'red'}}/>}</td>
                                    <td>
                                        <LinkContainer
                                            to={`/order/${order.id}`}>
                                            <Button variant='light'
                                                    className='btn-sm'>
                                                <i className='fas fa-info-circle'/>
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>

                            ))}
                            </tbody>
                        </Table>
                    )}
        </div>
    )
}

export default OrderListScreen


