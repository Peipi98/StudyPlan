import { Card, ListGroup} from 'react-bootstrap';
import { 
    Container, 
    Row, 
    Col,
    Accordion,
    Button} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

function Courses(props) {
    return(
        <Container>
            <Card>
                <Card.Header><h4>Corsi</h4></Card.Header>
                <Card.Body>
                    {props.loggedIn ? 
                        <>
                        <b>Legenda</b>
                        <p><b>P</b> = presente | <b>I</b> = incompatibile | <b>M</b> = max iscritti raggiunto</p>
                        </>
                        : ''}
                        <Card>
                            <Card.Header>
                        <Container fluid>
                            <Row>
                                {props.loggedIn ? <Col xs={1}/> : ''}
                                <Col xs={2}>
                                    <b>Codice</b><br/>
                                </Col>
                                <Col xs={3}>
                                    <b>Nome</b><br/>
                                </Col>
                                <Col>
                                    <b>Crediti</b><br/>
                                </Col>
                                <Col xs={1}>
                                    <b>Iscritti</b><br/>
                                </Col>
                                <Col>
                                    <b>Max iscritti</b><br/>
                                </Col>
                                <Col xs={2}>
                                <b>Descrizione</b>
                                </Col>
                            </Row>
                        </Container>
                        </Card.Header>
                        </Card>
                    <CourseTable courses={props.courses} studyPlan={props.studyPlan} user={props.user} loggedIn={props.loggedIn} addToStudyPlan = {props.addToStudyPlan}/>
                </Card.Body>
            </Card>
        </Container>
    )
}

function CourseTable(props) {

    return(
        <>
        <ListGroup className="d-flex w-100 justify-content-between">
        {props.courses.map((c) => {
                let isInSP = false;
                let isIncompatible = false;
                let cantEnroll = false;

                let message = '';

                if(props.loggedIn){
                    isInSP = props.studyPlan.filter(sp => sp.id === c.id).length > 0;

                    if(!isInSP) {
                        isIncompatible = props.studyPlan.filter(sp => 
                            sp.incompatibles ? 
                                sp.incompatibles.filter(stud=> stud === c.id).length > 0 
                                : false)
                            .length > 0;
                        if(!isIncompatible){
                            cantEnroll = c.max_students ? (c.max_students === c.enrolled) : false
                            if(cantEnroll)
                                message = 'M'
                        }
                        else
                            message = 'I'
                    }
                    else
                        message = 'P'
                }

                return(
                <CourseRow 
                    course={c} 
                    loggedIn={props.loggedIn} 
                    user={props.user} 
                    addToStudyPlan = {props.addToStudyPlan} 
                    disabled={isInSP || isIncompatible || cantEnroll}
                    message={message}
                    key={c.id}
                />)
            }
        )}
        </ListGroup>
        </>
    ) 
}

function CourseRow(props) {
    return(
            <Accordion defaultActiveKey="1">
                <Card>
                    <Card.Header>
                        <Container fluid>
                            <Row>
                                {props.loggedIn ? 
                                    (props.disabled ? 
                                        <Col xs={1}><Button variant='danger' disabled>{props.message}</Button></Col>
                                        : <Col xs={1}><Button onClick={() => props.addToStudyPlan(props.course)}>+</Button></Col>)
                                    : <></>}
                                <Col xs={2}>
                                    {props.course.id}
                                </Col>
                                <Col xs={3}>
                                    {props.course.name}
                                </Col>
                                <Col>
                                    {props.course.cfu}
                                </Col>
                                <Col>
                                    {props.course.enrolled}
                                </Col>
                                <Col>
                                    {props.course.max_students ?
                                        props.course.max_students : "N/D"}
                                </Col>
                                <Col xs={2}>
                                    <CustomToggle eventKey='0'>Descrizione</CustomToggle>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Header>
                    <Accordion.Collapse eventKey='0'>
                        <Card.Body>
                        <Row>
                            <Col>
                            <h6>Incompatibili</h6>
                            { props.course.incompatibles.length!==0 ? props.course.incompatibles.map((item) => 
                                <>{item}<br/></>
                            ) : <p>Nessun corso incompatibile</p>
                            }
                            </Col>
                            <Col>
                                <h6>Propedeutico</h6>
                                {props.course.propedeuticity ? props.course.propedeuticity : "Nessun corso propedeutico"}
                            </Col>
                        </Row>
                        </Card.Body>
                    </Accordion.Collapse>
 
                </Card>
            </Accordion>
    )
}

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);
  
    return (
      <Button
        onClick={decoratedOnClick}
      >
        {children}
      </Button>
    );
}

export {Courses, CustomToggle};