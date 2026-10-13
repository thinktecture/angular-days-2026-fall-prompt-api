export const ADD_TODO_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      description: 'The content of the todo item',
    },
  },
  required: ['text'],
};

export const TODO_TOOL = {
  type: 'function',
  function: {
    name: 'addTodo',
    description: 'Add a new todo item.',
    parameters: ADD_TODO_INPUT_SCHEMA,
  },
};
