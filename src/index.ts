#!/usr/bin/env node
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { Configuration, OpenAIApi } from "openai";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

const welcome = async () => {
  const welcomeMessageDisplay = chalkAnimation.rainbow(
    "Interact with ChatGPT within your terminal!\n"
  );

  await sleep();

  welcomeMessageDisplay.stop();
};

const prompt = async () => {
  console.log(chalk.red("Note: This token is not saved anywhere.\n"));

  const key = await inquirer.prompt({
    name: "k",
    type: "input",
    message: "What is your API key?\n",
  });

  const question = await inquirer.prompt({
    name: "q",
    type: "input",
    message: "What would you like to ask ChatGPT?\n",
  });

  const input = {
    apiKey: key.k as string,
    question: question.q as string,
  };

  chatGptApiCall(input.apiKey, input.question);
};

const chatGptApiCall = async (apiKey: string, question: string) => {
  const spinner = createSpinner().start({ text: "Loading..." });

  try {
    const configuration = new Configuration({
      apiKey,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0,
    });

    if (response.status === 200) {
      spinner.stop();
      console.log(response.data.choices[0].text);
    }
  } catch (e) {
    spinner.clear();
    console.log(chalk.red("Api is incorrect."));
    process.exit(1);
  }
};

await welcome();
await prompt();
