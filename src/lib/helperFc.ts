import { tavily } from "@tavily/core"
import { TAVILY_API_KEY } from "./constants";


const tvly = tavily({ apiKey: TAVILY_API_KEY! });

export async function webSearch({ query }: { query: string }) {
  const response = await tvly.search(query);
  console.log("response ----", response);
  
  const finalResult = response.results.map(result => result.content).join("\n\n")
  return finalResult;
}