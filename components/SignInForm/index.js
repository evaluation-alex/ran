import React from 'react';
import PropTypes from 'prop-types';
import AuthFields from '../AuthFields';
import validate from '../AuthFields/index.validation';
import connect from './index.data';

const defaultFunction = function defFunc() {};

class SignInForm extends React.Component {
  static defaultProps = {
    createUser: defaultFunction,
    signinDispatcher: defaultFunction,
    signinUser: defaultFunction,
    signinUserDispatcher: defaultFunction
  };

  static propTypes = {
    createUser: PropTypes.func,
    signinDispatcher: PropTypes.func,
    signinUser: PropTypes.func,
    signinUserDispatcher: PropTypes.func
  };

  state = {
    errors: {},
    serverErrors: {},
    touched: false
  };

  getServerErrors(err) {
    if (err.graphQLErrors) {
      const obj = {};
      obj.message = err.graphQLErrors[0].message;
      this.setState({
        serverErrors: obj
      });
    }
  }

  formFields = [
    { key: 1, attr: { name: 'email', type: 'email', label: 'Email' } },
    { key: 2, attr: { name: 'password', type: 'password', label: 'Password' } }
  ];

  handleTouch = () => {
    this.setState({ touched: true });
  };

  handleChange = e => {
    const fieldValue = e.target.value;
    const fieldName = e.target.name;
    const obj = {};
    obj[fieldName] = fieldValue;
    this.setState(obj);
  };

  handleSubmit(e, valuesPack) {
    e.preventDefault();
    const handleValidate = validate(valuesPack);

    if (handleValidate.touched) {
      this.setState({ touched: handleValidate.touched });
    }
    if (handleValidate.errors) {
      this.setState({ errors: handleValidate.errors });
    }

    this.props
      .signinUser(valuesPack)
      .then(response => {
        if (response.data) {
          this.props.signinUserDispatcher(response.data.signinUser.token);
        }
      })
      .catch(err => {
        this.getServerErrors(err);
      });
  }

  render() {
    const fields = this.formFields;
    // Packing all the necessary auth field states
    const valuesPack = {};

    fields.map(x => {
      const y = x.attr.name;
      valuesPack[y] = this.state[y];
      return valuesPack;
    });

    return (
      <div>
        <AuthFields
          handleSubmit={e => {
            this.handleSubmit(e, valuesPack);
          }}
          handleChange={this.handleChange}
          fields={fields}
          errors={this.state.errors}
          touched={this.state.touched}
          handleTouch={this.handleTouch}
          selectFields="signinFields"
        />
        <br />
        <div>
          {Object.keys(this.state.errors).length === 0 &&
            this.state.serverErrors.message}
        </div>
      </div>
    );
  }
}

export default connect(SignInForm);