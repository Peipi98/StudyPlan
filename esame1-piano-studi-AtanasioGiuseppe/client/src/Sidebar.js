import {Nav} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Sidebar(props) {
    const navigate = useNavigate();

    const prova = (filter) => {
        props.applyFilter(filter)
        if(filter === "/all")
            navigate('/')
        else
            navigate(filter)
    }
    
    return (
      <>
      <Nav className="col-md-12 d-none d-md-block sidebar"
      activeKey="/all"
      
      >
          <div className="sidebar-sticky"></div>
      <Nav.Item >
          <Nav.Link className='sidebar-link text-light nav-links' onClick={() => { prova('/all') }}>All</Nav.Link>
      </Nav.Item>
      <Nav.Item>
          <Nav.Link className='sidebar-link text-light nav-links' eventKey="" onClick={() => { prova('/favorites') }}>Favorites</Nav.Link>
      </Nav.Item>
      <Nav.Item>
          <Nav.Link className='sidebar-link text-light nav-links' eventKey="" onClick={() => { prova('/bestrated') }}>Best rated</Nav.Link>
      </Nav.Item>
      <Nav.Item>
          <Nav.Link className='sidebar-link text-light nav-links' eventKey="" onClick={() => { prova('/seenlastmonth') }}>Seen Last Month</Nav.Link>
      </Nav.Item>
      <Nav.Item>
          <Nav.Link className='sidebar-link text-light nav-links' eventKey="" onClick={() => { prova('/unseen') }}>Unseen</Nav.Link>
      </Nav.Item>
      </Nav>
    </>
    );
  }
  export default Sidebar;