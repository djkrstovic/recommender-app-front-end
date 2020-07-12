import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import TagType from '../../types/TagType';
import ApiTagsDto from '../../dtos/ApiTags.dto';

interface AdministratorDashboardTagState{
	isAdministratorLoggedIn: boolean;
	tags: TagType[];

	addModal:{
		visible: boolean;
		tagName: string;
		message: string;
	};
	editModal:{
		visible: boolean;
		tagId: number | null
		tagName: string;
		message: string;
	};
}

class AdministratorDashboardTag extends React.Component {
	state: AdministratorDashboardTagState;

	constructor(props: Readonly<{}>){
		super(props);

		this.state = {
			isAdministratorLoggedIn: true,
			tags: [],

			addModal:{
				visible: false,
				tagName: '',
				message: '',
			},
			editModal:{
				visible: false,
				tagId: null,
				tagName: '',
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
		this.getTags();
	}


    private getTags(){

        api('api/tags/', 'get', {}, 'administrator' )
        .then((res: ApiResponse) => {
            if(res.status === "error" || res.status === "login"){
				this.setLogginState(false);
				return;
			}

			this.putTvSeriesInState(res.data);
        });
	}
	
	private putTvSeriesInState(data: ApiTagsDto[]){
		const tags: TagType[] = data.map(tag => {
			return{
				tagName: tag.tagName,
				items: [],
			};
		});

		const newState = Object.assign(this.state, {
			tags: tags,
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
                        <FontAwesomeIcon icon={ faListAlt }/> Tags
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
									<th>Tag name</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{ this.state.tags.map(tag => (
									<tr>
										<td className="text-right">{ tag.tagId }</td>
										<td className="text-right">{ tag.tagName }</td>
										<td className="text-center">
											<Button variant="info" size="sm"
											onClick={ () => this.showEditModal(tag) }>
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
						<Modal.Title>Add new Tag</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label htmlFor="tagName">Tag name</Form.Label>
							<Form.Control id="tagName" type="text" value={ this.state.addModal.tagName }
								onChange={ (e)=> this.setAddModalStringFieldState('tagName', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Button variant="primary" onClick={ () => this.doAddTag() } >
							<FontAwesomeIcon icon={ faPlus }/> Add new Tag
							</Button>
						</Form.Group>
						{ this.state.addModal.message ? (
							<Alert variant="danger" value= { this.state.addModal.message }/>
						) : '' }
					</Modal.Body>
				</Modal>
				
				

				<Modal size="lg" centered show={ this.state.editModal.visible } onHide={ ()=> this.setEditModalVisibleState(false) }>
					<Modal.Header closeButton>
						<Modal.Title>Edit Tag</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label htmlFor="tagName">Tag</Form.Label>
							<Form.Control id="tagName" type="text" value={ this.state.editModal.tagName }
								onChange={ (e)=> this.setEditModalStringFieldState('tagName', e.target.value)}/>
						</Form.Group>
						<Form.Group>
							<Button variant="primary" onClick={ () => this.doEditTag() } >
							<FontAwesomeIcon icon={ faEdit }/> Edit Tag
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
		this.setAddModalStringFieldState('tagName', '');

		this.setAddModalStringFieldState('message', '');
		this.setAddModalVisibleState(true);
	}

	private doAddTag(){
		api('api/tags/createTag/', 'post', {
			tagName: this.state.addModal.tagName,
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
			this.getTags();
		})
	}
	private doEditTag(){
		api('api/tags/' + this.state.editModal.tagId, 'patch', {
			tagName: this.state.editModal.tagName,
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
			this.getTags();
		})
	}

	private showEditModal(tag: TagType){
		this.setEditModalStringFieldState('tagName', String(tag.tagName));

		this.setEditModalStringFieldState('message', '');
		this.setEditModalVisibleState(true);
	}
	

}

export default AdministratorDashboardTag;
