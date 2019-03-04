import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  clearNewProjectRepoUrl,
  addNewProject
} from '../../../store/actions/projectsActions';

import FormRepoSelector from './step-1/FormRepoSelector';
import FormEditProject from './step-2/FormEditProject';
import FormContributors from './step-3/FormContributors';

export class AddProject extends Component {
  state = {
    step: 1,
    refetchRepoInStep2: false,
    repoUrl: '',
    liveWebsiteUrl: '',
    title: '',
    description: '',
    images: [],
    tags: [],
    contributorsChecked: false,
    contributorsDescription: ''
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
    if (nextProps.project.liveWebsiteUrl)
      this.setState({ liveWebsiteUrl: nextProps.project.liveWebsiteUrl });
  }

  nextStep = ({ refetchRepoInStep2 = true } = {}) => {
    this.setState(prevState => ({
      step: prevState.step + 1,
      refetchRepoInStep2
    }));
  };

  prevStep = ({ refetchRepoInStep2 = false } = {}) => {
    this.setState(prevState => ({
      step: prevState.step - 1,
      refetchRepoInStep2
    }));
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSwitchChange = e => {
    this.setState({ contributorsChecked: e.target.checked });
  };

  onSubmit = e => {
    const {
      repoUrl,
      liveWebsiteUrl,
      title,
      description,
      images,
      tags,
      contributorsChecked,
      contributorsDescription
    } = this.state;
    this.props.addNewProject({
      repoUrl,
      liveWebsiteUrl,
      title,
      description,
      images,
      tags,
      contributorsChecked,
      contributorsDescription
    });
  };

  render() {
    const {
      step,
      refetchRepoInStep2,
      repoUrl,
      liveWebsiteUrl,
      title,
      description,
      images,
      tags,
      contributorsChecked,
      contributorsDescription
    } = this.state;

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
            values={{ liveWebsiteUrl, title, description, images, tags }}
            repoUrl={repoUrl}
            refetchRepo={refetchRepoInStep2}
          />
        );
      case 3:
        return (
          <FormContributors
            prevStep={this.prevStep}
            onSubmit={this.onSubmit}
            handleChange={this.handleChange}
            handleSwitchChange={this.handleSwitchChange}
            values={{
              checked: contributorsChecked,
              description: contributorsDescription
            }}
          />
        );
    }
  }
}

AddProject.propTypes = {
  project: PropTypes.object.isRequired,
  clearNewProjectRepoUrl: PropTypes.func.isRequired,
  addNewProject: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  project: state.projects.project
});

export default connect(
  mapStateToProps,
  { clearNewProjectRepoUrl, addNewProject }
)(AddProject);
