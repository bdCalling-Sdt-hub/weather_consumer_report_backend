import express from 'express';

export const myController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const receivedData = request.body;

    response.status(200).json({ _: '' });
  } catch (error: any) {
    console.log(error);
    // SENDING RESPONSE IF ANYTHING GOES WRONG---------------------------------------------------------------------

    response.status(500).json({ message: error });
  }
};
