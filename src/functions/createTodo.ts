import { v4 as uuidv4 } from 'uuid';
import { document } from '../utils/dynamodbClient';
import { APIGatewayProxyHandler } from 'aws-lambda';

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  await document
    .put({
      TableName: 'users_todos',
      Item: {
        title,
        done: false,
        id: uuidv4(),
        user_id: userid,
        deadline: new Date(deadline),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo created!',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
