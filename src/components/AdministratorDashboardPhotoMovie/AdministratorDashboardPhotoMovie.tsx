import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { faImages, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import PhotoMovieType from '../../types/PhotoMovieType';
import { ApiConfig } from '../../config/api.config';

interface AdministratorDashboardPhotoMovieProperties{
    match: {
        params: {
            mId: number;
        }
    }
}

interface AdministratorDashboardPhotoMovieState{
	isAdministratorLoggedIn: boolean;
	photoMovies: PhotoMovieType[];
}

class AdministratorDashboardPhotoMovie extends React.Component<AdministratorDashboardPhotoMovieProperties> {
	state: AdministratorDashboardPhotoMovieState;

	constructor(props: Readonly<AdministratorDashboardPhotoMovieProperties>){
		super(props);

		this.state = {
			isAdministratorLoggedIn: true,
			photoMovies: [],
		}
	}

	componentDidMount(){
		this.getPhotoMovies();
	}

	componentDidUpdate(oldProps: any){
        if(this.props.match.params.mId === oldProps.match.params.mId){
            return;
        }
        this.getPhotoMovies();
    }

	private getPhotoMovies(){
		api('/api/movie/'+ this.props.match.params.mId + '/?join=photoMovie', 'get', {}, 'administrator')
		.then((res: ApiResponse) => {
			if(res.status === 'error' || res.status === 'login'){
				this.setLogginState(false);
				return;

			}
			this.setState(Object.assign(this.state, {
				photoMovies: res.data.photoMovies,
			}));
		});
	}


	private setLogginState(isLoggedIn: boolean){
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
	}

	render(){

        if(this.state.isAdministratorLoggedIn === false){
			return(
				<Redirect to="/administrator/login"/>
			)
        }
        
        return(
            <Container>
                <RoledMainMenu role="administrator"/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faImages }/> Photos
                        </Card.Title>
						
						<Row>
							{ this.state.photoMovies.map(this.printSinglePhoto, this) }
						</Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

	private printSinglePhoto(photo: PhotoMovieType){
		return (
			<Col xs="12" sm="6" md="4" lg="3">
				<Card>
					<Card.Body>
						<img alt={"Photo " + photo.photoMovieId }
						src={ ApiConfig.PHOTO_PATH_MOVIE + 'thumb/' + photo.imagePath }
						className="w-100"/>
					</Card.Body>
					<Card.Footer>
						{ this.state.photoMovies.length > 1 ? (
							<Button variant="danger" block>
								<FontAwesomeIcon icon={ faMinus }/> Delete photo
							</Button>
						) : ''}
					</Card.Footer>

				</Card>
			</Col>
		);
	}

}

export default AdministratorDashboardPhotoMovie;
