export interface IApiResponse{
    statusCode: number; //HTTP status code (e.g., 200, 400, 500)
    success: boolean; //Indicates if the response is successful (true/false)
    message: string; // A message describing the response (e.g., success or error message)
    data: [] | {} | null; // The payload for successful responses (can be array, object, or null)
    error: string | {} | null; // The details of the error (string, object, or null for no error)
}