import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter } from 'lucide-react';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSuccess(true);
    setForm({ name: '', email: '', message: '' });
    setLoading(false);
    
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Contact Us</h2>
        <p className="text-muted">Get in touch with our team for support and inquiries</p>
      </div>

      <Row className="g-4">
        {/* Contact Form */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Send us a Message</h4>
              <p className="text-muted mb-4">
                Feel free to contact us anytime. We will get back to you as soon as we can!
              </p>

              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
                  Message sent successfully! We'll get back to you soon.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    size="lg"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    size="lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows={5}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  <Send size={18} />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Contact Info */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Contact Information</h5>
              
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-primary text-white p-2 rounded">
                  <Phone size={20} />
                </div>
                <div>
                  <h6 className="fw-semibold mb-1">Phone</h6>
                  <p className="text-muted mb-0">+91 8009 054294</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-success text-white p-2 rounded">
                  <Mail size={20} />
                </div>
                <div>
                  <h6 className="fw-semibold mb-1">Email</h6>
                  <p className="text-muted mb-0">info@potholedetection.com</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-warning text-white p-2 rounded">
                  <MapPin size={20} />
                </div>
                <div>
                  <h6 className="fw-semibold mb-1">Location</h6>
                  <p className="text-muted mb-0">
                    Available across major cities in India, USA, Canada & UAE
                  </p>
                </div>
              </div>

              <hr className="my-4" />

              <h6 className="fw-semibold mb-3">Follow Us</h6>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" className="rounded-circle" style={{ width: '40px', height: '40px', padding: 0 }}>
                  <Facebook size={18} />
                </Button>
                <Button variant="outline-danger" className="rounded-circle" style={{ width: '40px', height: '40px', padding: 0 }}>
                  <Instagram size={18} />
                </Button>
                <Button variant="outline-info" className="rounded-circle" style={{ width: '40px', height: '40px', padding: 0 }}>
                  <Twitter size={18} />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Map Section */}
      <Card className="shadow-sm border-0 mt-4">
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-3">Find Us on Map</h4>
          <p className="text-muted mb-4">
            Our service is available across multiple locations. Use the map to explore our coverage areas.
          </p>
          <div className="ratio ratio-16x9" style={{ maxHeight: '450px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d471220.5631094339!2d88.04952462217592!3d22.6757520733225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1596988408134!5m2!1sen!2sin"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              title="Google Map"
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ContactUs;
