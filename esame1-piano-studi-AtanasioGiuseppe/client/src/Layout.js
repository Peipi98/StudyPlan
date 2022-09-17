import MyNavbar from './MyNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';


function Layout(props){
    return(
        <div className="App">
            <Row>
                <MyNavbar loggedIn={props.loggedIn} logout={props.logout} username={props.username}/>
            </Row>
            <br></br>
            <Row className="justify-content-center" style={{height:"100vh"}}> 
            {props.loggedIn ? <>
                <Col xs={9}>
                    <Outlet/>
                </Col>
                </>
            :   <Col  xs={9}>
                    <Outlet/>
                </Col> }
            </Row>
        </div>
    )
}

export default Layout;