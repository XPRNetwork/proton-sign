import React, { useContext } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import PageLayout from '../../components/PageLayout';
import FileInfo from '../../components/FileInfo';
import { AppContext } from '../../components/Provider';

const AddSignersContainer = ({ history }) => {
  const { actor, docInfo } = useContext(AppContext);

  const onAddSigner = (_, values, setValues) => {
    const signers = [...values.signers];
    signers.push({ name: '', email: '' });
    setValues({ ...values, signers });
  };

  const validationSchema = Yup.object().shape({
    signers: Yup.array().of(
      Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email('Please use a valid email address'),
      })
    ),
  });

  const handleSubmit = (values, { setSubmitting }) => {
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
  }

  return (
    <PageLayout
      firstTitleLine="Who needs to sign this"
      secondTitleLine="document?">
      <FileInfo filename={docInfo.filename} filesize={docInfo.filesize}>
        <td className="right x-icon" onClick={() => history.push('/')}>
          <img src="./images/x.png" alt="x-icon" />
        </td>
      </FileInfo>
      <Formik
        initialValues={{ signers: [{ name: '', email: '' }] }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ values, setValues, isSubmitting }) => (
          <Form>
            <div className="fullwidth add-signer-container">
              <p>Signers</p>
              <button
                className="grey add-signer"
                onClick={(e) => onAddSigner(e, values, setValues)}>
                <img src="./images/addsigner.png" alt="Add Signer" />
                <span>Add signer</span>
              </button>
            </div>

            <FieldArray
              name="signers"
              render={() => (
                <table className="fullwidth">
                  <tbody>
                    <tr>
                      <td>
                        <label>Name</label>
                      </td>
                      <td className="halfwidth">
                        <label>Email</label>
                      </td>
                    </tr>
                  </tbody>
                  {values.signers.map((_, index) => (
                    <tbody key={index}>
                      <tr>
                        <td>
                          <Field
                            name={`signers.${index}.name`}
                            placeholder="John Doe"
                            className="signer-form-input"
                          />{' '}
                          <ErrorMessage
                            name={`signers.${index}.name`}
                            component="div"
                            className="signer-form-error"
                          />
                        </td>
                        <td>
                          <Field
                            name={`signers.${index}.email`}
                            type="email"
                            placeholder="johndoe@gmail.com"
                            className="signer-form-input"
                          />{' '}
                          <ErrorMessage
                            name={`signers.${index}.email`}
                            component="div"
                            className="signer-form-error"
                          />
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
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

export default AddSignersContainer;
