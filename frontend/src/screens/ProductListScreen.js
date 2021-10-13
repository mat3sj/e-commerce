import React, {useEffect} from "react";
import {Table, Button, Row, Col} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
    listProducts,
    deleteProduct,
    createProduct
} from "../actions/productActions";
import {PRODUCT_CREATE_RESET} from "../constants/productConstants";

function ProductListScreen({history, match}) {

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const {error, loading, products} = productList

    const productCreate = useSelector(state => state.productCreate)
    const {error: errorCreate, loading: loadingCreate, success: successCreate, product:  createdProduct} = productCreate

    const productDelete = useSelector(state => state.productDelete)
    const {error: errorDelete, loading: loadingDelete, success: successDelete} = productDelete

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin


    useEffect(() => {
        dispatch({type: PRODUCT_CREATE_RESET})
        if (!userInfo.is_admin) {
            history.push('/login')
        }

        if(successCreate){
            history.push(`/admin/product/${createdProduct.id}/edit`)
        }else{
            dispatch(listProducts())
        }

    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct])


    const createProductHandler = () => {
        dispatch(createProduct())
    }

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
        dispatch(deleteProduct(id))
        }
    }
    return (
        <div>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'> Create Product</i>
                    </Button>
                </Col>
            </Row>
            {loadingCreate && <Loader/>}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {loadingDelete && <Loader/>}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            <h1>Users</h1>
            {loading
                ? (<Loader/>)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive
                               className='table-sm'>
                            <thead>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>In stock</th>
                            <th>Actions</th>
                            </thead>
                            <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.count_in_stock}</td>
                                    <td>
                                        <LinkContainer
                                            to={`/admin/product/${product.id}/edit`}>
                                            <Button variant='light'
                                                    className='btn-sm'>
                                                <i className='fas fa-edit'/>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger'
                                                className='btn-sm'
                                                onClick={() => deleteHandler(product.id)}>
                                            <i className='fas fa-trash'/>
                                        </Button>
                                    </td>
                                </tr>

                            ))}
                            </tbody>
                        </Table>
                    )}
        </div>
    )
}

export default ProductListScreen


