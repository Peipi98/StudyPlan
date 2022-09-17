import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { Toast } from "react";

function LoginForm(props) {
    const [username, setUsername] = useState('testuser@polito.it'); //almeno tre film ed assegnare
    const [password, setPassword] = useState('testpassword');
    const [errorMessage, setErrorMessage] = useState('') ;

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username: username, password: password };
        
        // SOME VALIDATION, ADD MORE!!!
        let valid = true;
        //do more validation 
        if(username === '' || password === '')
            valid = false;
        if (username.length<3 || password.length<3){
            valid=false;
        }
        if(valid)
        {
          props.login(credentials);
        }
        else {
          // show a better error message...
          setErrorMessage('Error(s) in the form, please fix it.')
        }
    };

return (
    <Container>
        <Row>
            <Col>
                <h2>Login</h2>
                {errorMessage ? <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible>{errorMessage}</Alert> : false}
                <Form onSubmit={handleSubmit}>
                    {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                    <Form.Group controlId='username'>
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                    </Form.Group>
                    <br></br>
                    <Button type="submit">Login</Button>
                </Form>
            </Col>
        </Row>
    </Container>)
}

function LogoutButton(props) {
    return(
    <Col>
        <span>User: {props.user?.name}</span>{' '}<Button variant="outline-primary" onClick={props.logout}>Logout</Button>
    </Col>
    )
}

export { LoginForm, LogoutButton };


