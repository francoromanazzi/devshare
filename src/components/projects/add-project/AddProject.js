import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clearNewProjectRepoUrl } from '../../../store/actions/projectsActions';

import FormRepoSelector from './step-1/FormRepoSelector';
import FormEditProject from './step-2/FormEditProject';
import FormContributors from './step-3/FormContributors';

export class AddProject extends Component {
  state = {
    step: 1,
    repoUrl: '',
    title: '',
    description: '',
    images: [],
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
    if (nextProps.project.description)
      this.setState({ description: nextProps.project.description });
    if (nextProps.project.images)
      this.setState({ images: nextProps.project.images });
    if (nextProps.project.tags) this.setState({ tags: nextProps.project.tags });
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

  onSubmit = e => {};

  render() {
    const { step, repoUrl, title, description, images, tags } = this.state;

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
            values={{ title, description, images, tags }}
            repoUrl={repoUrl}
          />
        );
      case 3:
        return (
          <FormContributors
            prevStep={this.prevStep}
            onSubmit={this.onSubmit}
            handleChange={this.handleChange}
            values={{}}
          />
        );
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
