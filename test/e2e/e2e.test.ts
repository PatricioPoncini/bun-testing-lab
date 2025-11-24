import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { RedisService } from "../../src/services/redisService.ts";
import { HttpServer } from "../../src/http/server.ts";
import axios, { type AxiosResponse } from "axios";
import type {GetMessagesResponse, PostMessageResponse} from "../utils/types.ts";

describe("Messages API – End-to-End Tests", () => {
  beforeAll(async () => {
    await RedisService.start();
    await HttpServer.start();
  });

  beforeEach(async () => {
      // Reset Redis database before each test
    await RedisService.op().flushAll();
  });

  afterAll(async () => {
    await RedisService.stop();
    await HttpServer.stop();
  });

  describe("GET /messages endpoint", async () => {
    test("Should return an empty list when no messages are stored", async () => {
      const response = await axios.get<GetMessagesResponse>(
        "http://localhost:3000/messages",
      );
      expect(response.status).toBe(200);
      expect(response.data.count).toEqual(0);
      expect(response.data.messages.length).toEqual(0);
    });

    test("Should return a single message when one message is stored", async () => {
      await RedisService.op().lPush("messages", "test");
      const response = await axios.get<GetMessagesResponse>(
        "http://localhost:3000/messages",
      );
      expect(response.status).toBe(200);
      expect(response.data.count).toEqual(1);
      expect(response.data.messages.length).toEqual(1);
    });
  });

  describe("POST /messages endpoint", async () => {
    test("Should save a valid message successfully", async () => {
      const body = {
        text: "hi",
      };
      const response = await axios.post<PostMessageResponse>(
        "http://localhost:3000/messages",
        body,
      );
      expect(response.status).toBe(200);
      expect(response.data.ok).toBeTruthy();
    });

    test("Should reject a message when 'text' is a number", async () => {
      const body = { text: 1 };

      const response: AxiosResponse<{ error: string }> = await axios.post(
        "http://localhost:3000/messages",
        body,
        { validateStatus: () => true },
      );

      expect(response.status).toBe(400);
      expect(response.data.error).toBe(
        "Invalid body: expected { text: string }",
      );
    });

    test("Should reject a message when 'text' is missing or null", async () => {
      const body = {};

      const response: AxiosResponse<{ error: string }> = await axios.post(
        "http://localhost:3000/messages",
        body,
        { validateStatus: () => true },
      );

      expect(response.status).toBe(400);
      expect(response.data.error).toBe(
        "Invalid body: expected { text: string }",
      );
    });

    test("Should reject a message when 'text' is an empty string", async () => {
      const body = { text: "" };

      const response: AxiosResponse<{ error: string }> = await axios.post(
        "http://localhost:3000/messages",
        body,
        { validateStatus: () => true },
      );

      expect(response.status).toBe(400);
      expect(response.data.error).toBe(
        "Invalid body: expected { text: string }",
      );
    });

    test("Should reject a message when 'text' is a boolean", async () => {
      const body = { text: true };

      const response: AxiosResponse<{ error: string }> = await axios.post(
        "http://localhost:3000/messages",
        body,
        { validateStatus: () => true },
      );

      expect(response.status).toBe(400);
      expect(response.data.error).toBe(
        "Invalid body: expected { text: string }",
      );
    });

    test("should handle multiple POST requests at the same time without losing messages", async () => {
      const messages = ["msg1", "msg2", "msg3", "msg4", "msg5"];

      await Promise.all(
        messages.map((text) =>
          axios.post<PostMessageResponse>("http://localhost:3000/messages", {
            text,
          }),
        ),
      );

      const getResponse = await axios.get<GetMessagesResponse>(
        "http://localhost:3000/messages",
      );

      expect(getResponse.status).toBe(200);
      expect(getResponse.data.count).toBe(messages.length);

      messages.forEach((msg) => {
        expect(getResponse.data.messages).toContain(msg);
      });
    });
  });

  describe("Combined POST & GET workflow", async () => {
    test("Should save a valid message and then retrieve it", async () => {
      const body = {
        text: "hi",
      };
      const postResponse = await axios.post<PostMessageResponse>(
        "http://localhost:3000/messages",
        body,
      );
      expect(postResponse.status).toBe(200);
      expect(postResponse.data.ok).toBeTruthy();

      const getResponse = await axios.get<GetMessagesResponse>(
        "http://localhost:3000/messages",
      );
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.count).toEqual(1);
      expect(getResponse.data.messages.length).toEqual(1);
    });

    test("Should not save an invalid message and GET should return an empty list", async () => {
      const body = {
        text: 1,
      };
      const postResponse: AxiosResponse<{ error: string }> = await axios.post(
        "http://localhost:3000/messages",
        body,
        { validateStatus: () => true },
      );
      expect(postResponse.status).toBe(400);
      expect(postResponse.data.error).toBe(
        "Invalid body: expected { text: string }",
      );

      const getResponse = await axios.get<GetMessagesResponse>(
        "http://localhost:3000/messages",
      );
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.count).toEqual(0);
      expect(getResponse.data.messages.length).toEqual(0);
    });
  });
});
