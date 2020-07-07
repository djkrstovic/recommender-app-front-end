import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Card } from 'react-bootstrap';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

export default class UserLoginPage extends React.Component{
    render(){
        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faSignInAlt }/> User Login
                        </Card.Title>
                        <Card.Text>
                            ... the from will be show here...
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );    
    }
}