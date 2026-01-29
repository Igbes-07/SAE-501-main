const message = {
  type: "object",
  properties: {
      _id: { 
            type: "string", 
            pattern: "([0-9a-f]{24})" 
          },
      firstName: { 
        type: "string" 
      },
      lastName: { 
        type: "string" 
      },
      email: { 
        type: "string" 
      },
      content: { 
        type: "string" 
      }, 
      je_suis: { 
        type: "string" 
      }, 
      created_at: {
            type: "string",
            format: "date-time",
        },
        updatedAt: {
            type: "string",
            format: "date-time",
     },
  },
};

export { message };

export default {
      type: "object",
      properties: {
          count: {
              type: "integer",
          },
          total_pages: {
              type: "integer",
          },
          page: {
              type: "integer",
          },
          query_params: {
              type: "string",
          },
          data: {
              type: "array",
              items: message,
          },
  },
};
