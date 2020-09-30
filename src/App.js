import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Form, Input, Button, message, Statistic, Result } from 'antd';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import './App.css';

const { Title } = Typography;

const App = () => {
  const [ form ] = Form.useForm();

  const [ currentQuestion, setCurrentQuestion ] = useState( null );
  const [ totalPoints, setTotalPoints ] = useState( 0 );
  const [ points, setPoints ] = useState( 0 );
  const [ numQuestions, setNumQuestions ] = useState( 0 );

  useEffect( () => {
    const getQuestion = async() => {
      const questionResponse = await fetch( 'http://jservice.io/api/random' );
      const questionJSON = await questionResponse.json();

      console.log( 'questionJSON', questionJSON );
      setCurrentQuestion( questionJSON[ 0 ] );
      setNumQuestions( ( prevState ) => prevState + 1 );
    };

    getQuestion();
  }, [ totalPoints ] );

  const handleSubmit = ( { answer } ) => {

    const questionValue = currentQuestion.value
      ? currentQuestion.value
      : 100;

    if( answer.toLowerCase() === currentQuestion.answer.toLowerCase() ) {
      console.log( 'correcto' );
      setPoints( ( prevState ) => prevState + questionValue );
      message.success( 'Correcto' );
    } else {
      console.log( 'incorrecto' );
      message.error( 'Incorrecto' );
    }

    form.resetFields();
    setTotalPoints( ( prevState ) => prevState + questionValue );

  };

  const getResult = () => {
    const result = (points * 100) / totalPoints;
    if( result >= 80 ) {
      return <Result
        icon={ <SmileOutlined /> }
        title='Ganaste!'
        extra={ <Button type='primary' onClick={ resetGame }>Jugar de nuevo</Button> }
      />;
    } else {
      return <Result
        icon={ <FrownOutlined /> }
        title='Perdiste!'
        extra={ <Button type='primary' onClick={ resetGame }>Jugar de nuevo</Button> }
      />;
    }
  };

  const resetGame = () => {
    setNumQuestions( 0 );
    setPoints( 0 );
    setTotalPoints( 0 );
  };

  return (
    <>
      {
        numQuestions <= 10
          ? <>
            <Row justify='center'>
              <Col>
                Pregunta # { numQuestions }
              </Col>
              <Col span={ 12 } align='end'>
                <Statistic title='Puntos' value={ points } suffix={ ` / ${ totalPoints }` } />
              </Col>
            </Row>
            <Row justify='center'>
              <Col span={ 12 }>
                {
                  currentQuestion
                    ? <Title>{ currentQuestion.question }</Title>
                    : 'Cargando pregunta...'
                }
              </Col>
            </Row>

            <Row justify='center'>
              <Col span={ 12 }>
                <Form form={ form } onFinish={ handleSubmit }>
                  <Form.Item name='answer' label='Respuesta' rules={ [
                    {
                      required: true,
                      message: 'Ingresa la respuesta'
                    }
                  ] }>
                    <Input />
                  </Form.Item>

                  <Form.Item>
                    <Button htmlType='submit' type='primary'>Verificar respuesta</Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </>
          : getResult()
      }
    </>
  );
};

export default App;
