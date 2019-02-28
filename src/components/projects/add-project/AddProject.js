import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clearNewProjectRepoUrl } from '../../../store/actions/projectsActions';

import FormRepoSelector from './FormRepoSelector';
import FormEditProject from './FormEditProject';

export class AddProject extends Component {
  state = {
    step: 1,
    repoUrl: '',
    title: '',
    description: '',
    pictures: [],
    tags: []
  };

  componentWillReceiveProps(nextProps) {
    const { clearNewProjectRepoUrl } = this.props;

    if (nextProps.project.repoUrl && nextProps.project.repoUrl !== '')
      this.setState({ repoUrl: nextProps.project.repoUrl }, () =>
        clearNewProjectRepoUrl()
      );

    if (nextProps.project.title)
      this.setState({ title: nextProps.project.title });
  }

  nextStep = () => {
    this.setState(prevState => ({ step: prevState.step + 1 }));
  };

  prevStep = () => {
    this.setState(prevState => ({ step: prevState.step - 1 }));
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { step, repoUrl, title, description, pictures, tags } = this.state;

    switch (step) {
      case 1:
        return (
          <FormRepoSelector
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={{ repoUrl }}
          />
        );
      case 2:
        return (
          <FormEditProject
            prevStep={this.prevStep}
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={{ title, description, pictures, tags }}
            repoUrl={repoUrl}
          />
        );
      case 3:
        return <div>Step 3</div>;
      case 4:
        return <div>Success</div>;
    }
  }
}

AddProject.propTypes = {
  project: PropTypes.object.isRequired,
  clearNewProjectRepoUrl: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  project: state.projects.project
});

export default connect(
  mapStateToProps,
  { clearNewProjectRepoUrl }
)(AddProject);
