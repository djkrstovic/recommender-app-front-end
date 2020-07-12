import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import GenreType from '../../types/GenreType';
import ApiGenreDto from '../../dtos/ApiGenre.dto';

interface AdministratorDashboardGenreState{
	isAdministratorLoggedIn: boolean;
	genres: GenreType[];

	addModal:{
		visible: boolean;
		name: string;
		message: string;
	};
	editModal:{
		visible: boolean;
		genreId: number | null;
		name: string;
		message: string;
	};
}

class AdministratorDashboardGenre extends React.Component {
	state: AdministratorDashboardGenreState;

	constructor(props: Readonly<{}>){
		super(props);

		this.state = {
			isAdministratorLoggedIn: true,
			genres: [],

			addModal:{
				visible: false,
				name: '',
				message: '',
			},
			editModal:{
				visible: false,
				genreId: null,
				name: '',
				message: '',
			},
		}
	}

	private setAddModalVisibleState(newState: boolean){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				visible: newState,
			})
		));
	}

	private setAddModalStringFieldState(fieldName: string, newValue: string){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				[ fieldName ]: newValue,
			})
		));
	}

	private setAddModalNumberFieldState(fieldName: string, newValue: any){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.addModal, {
				[ fieldName ]: (newValue==='null') ? null : Number(newValue),
			})
		));
	}
 
	private setEditModalVisibleState(newState: boolean){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.editModal, {
				visible: newState,
			})
		));
	}

	private setEditModalStringFieldState(fieldName: string, newValue: string){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.editModal, {
				[ fieldName ]: newValue,
			})
		));
	}

	private setEditModalNumberFieldState(fieldName: string, newValue: any){
		this.setState(Object.assign(this.state, 
			Object.assign(this.state.editModal, {
				[ fieldName ]: (newValue==='null') ? null : Number(newValue),
			})
		));
	}

	componentWillMount(){
		this.getGenre();
	}
    private getGenre(){

        api('api/genres/', 'get', {}, 'administrator' )
        .then((res: ApiResponse) => {
            if(res.status === "error" || res.status === "login"){
				this.setLogginState(false);
				return;
			}

			this.putGenresInState(res.data);
        });
	}
	
	private putGenresInState(data: ApiGenreDto[]){
		const genres: GenreType[] = data.map(genre => {
			return{
				name: genre.name,
			};
		});

		const newState = Object.assign(this.state, {
			genres: genres,
		});

		this.setState(newState);
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

        return (
			<Container>
				<RoledMainMenu role="administrator"/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> Genres
                        </Card.Title>

						<Table hover size="sm" bordered>
							<thead>
								<tr>
									<th colSpan={2}></th>
									<th className="text-center">
										<Button variant="primary" size="sm"
										onClick={ ()=> this.showAddModal() }>
											<FontAwesomeIcon icon={ faPlus }/> Add
										</Button>
									</th>
								</tr>
								<tr>
									<th className="text-right">ID</th>
									<th>Genre name</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{ this.state.genres.map(genre => (
									<tr>
										<td className="text-right">{ genre.genreId }</td>
										<td className="text-right">{ genre.name }</td>
										<td className="text-center">
											<Button variant="info" size="sm"
											onClick={ () => this.showEditModal(genre) }>
											<FontAwesomeIcon icon={ faEdit }/> Edit
											</Button></td>
										</tr>
								), this) }
							</tbody>
							
						</Table>
						
						
                    </Card.Body>
                </Card>


				<Modal size="lg" centered show={ this.state.addModal.visible } onHide={ ()=> this.setAddModalVisibleState(false) }>
					<Modal.Header closeButton>
						<Modal.Title>Add new Genre</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label htmlFor="name">Genre name</Form.Label>
							<Form.Control id="name" type="text" value={ this.state.addModal.name }
								onChange={ (e)=> this.setAddModalStringFieldState('name', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Button variant="primary" onClick={ () => this.doAddGenre() } >
							<FontAwesomeIcon icon={ faPlus }/> Add new Genre
							</Button>
						</Form.Group>
						{ this.state.addModal.message ? (
							<Alert variant="danger" value= { this.state.addModal.message }/>
						) : '' }
					</Modal.Body>
				</Modal>
				
				

				<Modal size="lg" centered show={ this.state.editModal.visible } onHide={ ()=> this.setEditModalVisibleState(false) }>
					<Modal.Header closeButton>
						<Modal.Title>Edit Genre</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label htmlFor="name">Genre name</Form.Label>
							<Form.Control id="name" type="text" value={ this.state.editModal.name }
								onChange={ (e)=> this.setEditModalStringFieldState('name', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Button variant="primary" onClick={ () => this.doEditGenre() } >
							<FontAwesomeIcon icon={ faEdit }/> Edit Genre
							</Button>
						</Form.Group>
						{ this.state.editModal.message ? (
							<Alert variant="danger" value= { this.state.editModal.message }/>
						) : '' }
					</Modal.Body>
				</Modal>

				
            </Container>
        );
	}
	
	private showAddModal(){
		this.setAddModalStringFieldState('name', '');

		this.setAddModalStringFieldState('message', '');
		this.setAddModalVisibleState(true);
	}

	private doAddGenre(){
		api('api/genres/createGenre/', 'post', {
			tagName: this.state.addModal.name,
		}, 'administrator')
		.then((res: ApiResponse) => {
			if(res.status === "login"){
				this.setLogginState(false);
				return;
			}

			if(res.status === "error"){
				this.setAddModalStringFieldState('message', JSON.stringify(res.data));
				return;
			}

			this.setAddModalVisibleState(false);
			this.getGenre();
		})
	}
	private doEditGenre(){
		api('api/genres/' + this.state.editModal.genreId, 'patch', {
			name: this.state.editModal.name,
		}, 'administrator')
		.then((res: ApiResponse) => {
			if(res.status === "login"){
				this.setLogginState(false);
				return;
			}

			if(res.status === "error"){
				this.setEditModalStringFieldState('message', JSON.stringify(res.data));
				return;
			}

			this.setEditModalVisibleState(false);
			this.getGenre();
		})
	}

	private showEditModal(genre: GenreType){
		this.setEditModalStringFieldState('name', String(genre.name));

		this.setEditModalStringFieldState('message', '');
		this.setEditModalVisibleState(true);
	}

}

export default AdministratorDashboardGenre;
