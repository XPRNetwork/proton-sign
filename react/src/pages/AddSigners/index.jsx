import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import PageLayout from '../../components/PageLayout';
import FileInfo from '../../components/FileInfo';
import { AppContext } from '../../components/Provider';

class AddSignersContainer extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
    };
  }

  onAddSigner(_, values, setValues) {
    const signers = [...values.signers];
    signers.push({ name: '', email: '' });
    setValues({ ...values, signers });
  }

  render() {
    const { history } = this.props;
    const { accountData, actor, docInfo } = this.context;
    const validationSchema = Yup.object().shape({
      signers: Yup.array().of(
        Yup.object().shape({
          name: Yup.string(),
          email: Yup.string().email('Please use a valid email address'),
        })
      ),
    });

    return (
      <PageLayout
        avatar={accountData.avatar}
        firstTitleLine="Who needs to sign this"
        secondTitleLine="document?">
        <FileInfo filename={docInfo.filename} filesize={docInfo.filesize} />
        <Formik
          initialValues={{ signers: [{ name: '', email: '' }] }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              const formData = new FormData();
              for (let key in values.signers) {
                formData.append('name' + key, `${values.signers[key].name}`);
                formData.append('email' + key, `${values.signers[key].email}`);
              }
              formData.append('sa', actor);
              formData.append('docrequestid', docInfo.id); // TODO fix this

              axios
                .post('/psignapi/addsigners.php', formData)
                .then((res) => {
                  const isValidResponse = typeof res === 'object' && res !== null && 'data' in res;

                  if (isValidResponse) {
                    const data = res.data;
                    const isObject = typeof data === 'object' && data !== null;
                    const isError = isObject && 'error' in data;
                    const isResult = isObject && 'result' in res.data;
                    
                    if (isError) {
                      console.warn('error: ' + data['error']);
                      alert('error: ' + data['error']);
                    }

                    if (isResult) {
                      console.warn('result: ' + data['result']);
                      history.push({
                        pathname: '/signersnotified',
                      });
                    }
                  } else {
                    console.warn('unsuccessful post');
                  }
                })
                .catch((err) => console.error(err));
              setSubmitting(false);
            }, 400);
          }}>
          {({ values, setValues, isSubmitting }) => (
            <Form>
              <table className="fullwidth">
                <tr>
                  <td>
                    <p>Signers</p>
                  </td>
                  <td
                    className="grey right"
                    onClick={(e) => this.onAddSigner(e, values, setValues)}>
                    <img src="./images/addsigner.png" alt="Add Signer" /> Add
                    signer
                  </td>
                </tr>
              </table>

              <FieldArray
                name="signers"
                render={() => (
                  <div>
                    <table className="fullwidth">
                      <tr>
                        <td>
                          <label>Name</label>
                        </td>
                        <td className="halfwidth">
                          <label>Email</label>
                        </td>
                      </tr>
                      {values.signers.map((_, index) => (
                        <tr key={index}>
                          <td>
                            <Field
                              name={`signers.${index}.name`}
                              placeholder="John Doe"
                            />{' '}
                            <ErrorMessage
                              name={`signers.${index}.name`}
                              component="div"
                            />
                          </td>
                          <td>
                            <Field
                              name={`signers.${index}.email`}
                              type="email"
                              placeholder="johndoe@gmail.com"
                            />{' '}
                            <ErrorMessage
                              name={`signers.${index}.email`}
                              component="div"
                            />
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                )}
              />

              <button className="lavbutton" disabled={isSubmitting}>
                Submit for signing
              </button>
            </Form>
          )}
        </Formik>
      </PageLayout>
    );
  }
}

export default AddSignersContainer;
