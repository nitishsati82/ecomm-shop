import React, { useEffect,useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Container, Row, Col, Card, Form  } from 'react-bootstrap';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'ap-south-1' // Replace with your desired AWS region
});
const Profile = () => {
  const auth = useAuth();
  // Fetch user details from the OIDC context
  const { user } = auth;
  const profile = user?.profile;
  const accessToken = user?.access_token;
  const desiredAttributes = ["email", "phone_number", "preferred_username", "name", "address"];
  const [userAttributes, setUserAttributes] = useState([]);
  
  const formatAttributeName = (name) => {
    return name.replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };


  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

  const getUserAttributes = async (accessToken) => {
    const params = {
      AccessToken: accessToken,
    };

    try {
      const userData = await cognitoIdentityServiceProvider.getUser(params).promise();
      const filteredAttributes = userData.UserAttributes.filter(attribute => 
        desiredAttributes.includes(attribute.Name)
      );
      setUserAttributes(filteredAttributes);
      console.log('User attributes:', userData.UserAttributes);
    } catch (error) {
      console.error('Error getting user attributes:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getUserAttributes(accessToken);
    }
  }, [accessToken]);

  return (
    <Container className="profile-container" style={{ padding: "20px" }}>
      <h2>User Profile</h2>
      {userAttributes.length > 0 ? (
        <Card>
          <Card.Body>
            <Row className="profile-details">
              {userAttributes.map((attribute) => (
                <Col className="profile-item" md={6} key={attribute.Name}>
                  <Form.Group>
                    <Form.Label>{formatAttributeName(attribute.Name)}</Form.Label>
                    <Form.Control type="text" value={attribute.Value} readOnly />
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading profile...</p>
      )}
    </Container>

  );
};

export default Profile;