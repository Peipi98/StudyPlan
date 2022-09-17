import {Navbar} from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import {BsBook} from "react-icons/bs";
import {FaUserCircle} from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";

function MyNavbar(props) {
  const navigate = useNavigate()
    return (
        <Navbar bg="dark" variant='dark'expanded sticky="top">
          
        <Container fluid>
          <>
            <IconContext.Provider value={{size:"2em", color:"white"}}>
                <BsBook />
            </IconContext.Provider>&nbsp;
            <Navbar.Brand className="text-light" onClick={() => {navigate('/')}}>Piano di studi</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
          </>
          <Navbar.Collapse className="justify-content-end">
            {props.loggedIn ? 
              (<>
                <Navbar.Text>
                  Signed in as: {props.username}
                </Navbar.Text>&nbsp;
                <Button variant="outline-danger" onClick={props.logout}>Logout</Button>
              </>)
              : <Button onClick={() => navigate('/login')}>Login</Button>}&nbsp;

            <IconContext.Provider value={{size:"2em", color:"white"}}>
              <FaUserCircle/>
            </IconContext.Provider>   
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  
  export default MyNavbar;