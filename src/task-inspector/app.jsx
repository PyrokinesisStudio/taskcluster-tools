import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col } from 'react-bootstrap';
import TaskInspector from './taskinspector';
import * as utils from '../lib/utils';
import Layout from '../lib/Layout';

const hashManager = utils.createHashManager({ separator: '/' });

ReactDOM.render((
  <Layout>
    <Row style={{ marginBottom: 50 }}>
      <Col md={10} mdOffset={1}>
        <TaskInspector hashEntry={hashManager.root()}/>
      </Col>
    </Row>
  </Layout>
), document.getElementById('root'));
