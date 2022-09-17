import { useState, useEffect } from 'react'
import {
    Card, 
    ListGroup, 
    Accordion, 
    Container, 
    Button,
    Row, Col} from 'react-bootstrap'

import {CustomToggle} from './CourseList'

function StudyPlan(props) {
    const [hasSP, setHasSP] = useState(props.user.hasStudyPlan)
    const [isFT, setIsFT] = useState(props.user.isFullTime);
    const [initialLoading, setInitialLoading] = useState(true);

    const handleCreation = (flag) => {
        setHasSP(true);
        setIsFT(flag)
    }

    const handleDelete = () => {
        props.deleteSP(props.user.username)
        setHasSP(false)
    }

    const handleSubmit = () => {
        let updated = props.updateStudyPlan(isFT)
        if(updated){
            setHasSP(true)
        }
    }

    const undoModifications = () => {
        props.refreshStudyPlan();
        setHasSP(props.user.hasStudyPlan)
        setIsFT(props.user.isFullTime)
        setInitialLoading(true)
    }

    return(
        <Container>
            <Card>
                <Card.Header><h4>Piano di studi</h4></Card.Header>
                <Card.Body>
                {hasSP ? 
                    <>
                    <SPTable 
                        courses={props.courses} 
                        user={props.user} 
                        removeFromStudyPlan={props.removeFromStudyPlan} 
                        deleteSP={props.deleteSP}
                        limits = {isFT ? {min:60, max:80} : {min:20, max:40}}
                    />
                    </>
                    : <>
                        <Card.Text>
                            Non hai ancora un piano di studi.
                            <br/>
                            Seleziona il tipo di iscrizione:
                        </Card.Text>
                        <Button onClick={() => handleCreation(1)}>Full Time</Button>&nbsp;
                        <Button onClick={() => handleCreation(0)}>Part Time</Button>
                    </>}
                </Card.Body>
                {hasSP ?
                    <Card.Footer>
                        <Button onClick={handleSubmit}>Conferma Piano di Studi</Button>&nbsp;
                        <Button variant='danger' onClick={handleDelete}>Elimina piano di studi</Button>&nbsp;
                        {props.dirty ? <Button onClick={undoModifications}>Annulla modifiche</Button> : ''}
                    </Card.Footer> : ''}
            </Card>
        </Container>
    )
}

function SPTable(props) {
    const [credits, setCredits] = useState();

    const updateCredits = () => {
        if(props.courses.length > 1){
            let cfu = props.courses.reduce(function (c1, c2) {return c1 + c2.cfu;}, 0);
            setCredits(cfu);
        }
        else if(props.courses.length === 1 ){
            let list = [...props.courses]
            setCredits(list[0].cfu)
        } else {
            setCredits(0)
        }
    }

    useEffect(() => {
        updateCredits();
    }, [props.courses])

    return(
        <>
        <Card.Text>
            <b> Min. crediti: {props.limits.min} | 
                Max crediti: {props.limits.max} | 
                Crediti scelti: <font color={(credits > props.limits.max) || (credits < props.limits.min) ? 'red' : ''}>{credits}</font>
            </b>
        </Card.Text> 
        <Card>
            <Card.Header>
                <Container fluid>
                    <Row>
                        <Col xs={1}/>
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
        
        <ListGroup className="d-flex w-100 justify-content-between">
        {props.courses.map((c) => 
                    <SPRow 
                        course={c} 
                        user={props.user} 
                        removeFromStudyPlan={props.removeFromStudyPlan}
                        key={c.id}/>
        )}
        </ListGroup>
        </>
    ) 
}

function SPRow(props) {

    // const decoratedOnClick = useAccordionButton(eventKey, onClick);
    return(
        <Accordion defaultActiveKey="1">
            <Card>
                <Card.Header>
                    <Container fluid>
                        <Row>
                            <Col xs={1}>
                                <Button variant='danger'
                                    onClick={() => {props.removeFromStudyPlan(props.course)}}>-</Button>
                            </Col>
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
                            <Col>
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

export {StudyPlan}