import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  clearNewProjectRepoUrl,
  addNewProject
} from '../../../store/actions/projectsActions';

import FormStepper from './FormStepper';
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

    if (
      nextProps.project.repoUrl !== undefined &&
      nextProps.project.repoUrl !== ''
    )
      this.setState({ repoUrl: nextProps.project.repoUrl }, () =>
        clearNewProjectRepoUrl()
      );
    if (nextProps.project.title !== undefined)
      this.setState({ title: nextProps.project.title });
    if (nextProps.project.description !== undefined)
      this.setState({ description: nextProps.project.description });
    if (nextProps.project.images !== undefined)
      this.setState({ images: nextProps.project.images });
    if (nextProps.project.tags !== undefined)
      this.setState({ tags: nextProps.project.tags });
    if (nextProps.project.liveWebsiteUrl !== undefined)
      this.setState({ liveWebsiteUrl: nextProps.project.liveWebsiteUrl });
    if (nextProps.project.contributorsChecked !== undefined)
      this.setState({
        contributorsChecked: nextProps.project.contributorsChecked
      });
    if (nextProps.project.contributorsDescription !== undefined)
      this.setState({
        contributorsDescription: nextProps.project.contributorsDescription
      });
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
    this.props.addNewProject(
      {
        repoUrl,
        liveWebsiteUrl,
        title,
        description,
        images,
        tags,
        contributorsChecked,
        contributorsDescription
      },
      this.props.history
    );
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
          <React.Fragment>
            <FormStepper step={step} />
            <FormRepoSelector
              nextStep={this.nextStep}
              handleChange={this.handleChange}
              values={{ repoUrl }}
            />
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <FormStepper step={step} />
            <FormEditProject
              prevStep={this.prevStep}
              nextStep={this.nextStep}
              handleChange={this.handleChange}
              values={{ liveWebsiteUrl, title, description, images, tags }}
              repoUrl={repoUrl}
              refetchRepo={refetchRepoInStep2}
            />
          </React.Fragment>
        );
      case 3:
        return (
          <React.Fragment>
            <FormStepper step={step} />
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
          </React.Fragment>
        );
      default:
        return null;
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

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    { clearNewProjectRepoUrl, addNewProject }
  )
)(AddProject);
