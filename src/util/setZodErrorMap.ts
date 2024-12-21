import { z } from "zod";

import getKoreanPath from "util/getKoreanPath";
import hasJongseong from "util/hasJongseong";

export default function setZodErrorMap() {
  // https://zod.dev/ERROR_HANDLING?id=zodissuecode

  z.setErrorMap((error, ctx) => {
    // 경로 문자열을 한글로 변환
    const pathString = getKoreanPath(error.path).join(", ");

    // 주격 조사와 보조사 추가
    const isNotKorean = !/[ㄱ-ㅎ가-힣]/.test(pathString.at(-1) ?? "");
    const pathStringAsSubject = `${pathString}${
      isNotKorean ? "이(가)" : hasJongseong(pathString) ? "이" : "가"
    }`;
    const pathStringWithBojosa = `${pathString}${
      isNotKorean ? "은(는)" : hasJongseong(pathString) ? "은" : "는"
    }`;

    // 에러 코드에 따른 메시지 반환
    switch (error.code) {
      // invalid_union
      case z.ZodIssueCode.invalid_union: {
        return { message: `${pathStringAsSubject} 올바른 형식이 아니에요.` };
      }

      // invalid_type
      case z.ZodIssueCode.invalid_type: {
        if (error.received === "undefined")
          return { message: `${pathStringAsSubject} 전송되지 않았어요.` };
        return { message: `${pathStringAsSubject} 올바른 형식이 아니에요.` };
      }

      // invalid_date
      case z.ZodIssueCode.invalid_date: {
        return {
          message: `${pathStringAsSubject} 올바른 날짜 형식이 아니에요.`,
        };
      }

      // invalid_string
      case z.ZodIssueCode.invalid_string: {
        if (error.validation === "email")
          return {
            message: `${pathStringAsSubject} 올바른 이메일 주소 형식이 아니에요.`,
          };
        if (error.validation === "url")
          return {
            message: `${pathStringAsSubject} 올바른 URL 형식이 아니에요.`,
          };
        return {
          message: `${pathStringAsSubject} 올바른 문자열 형식이 아니에요.`,
        };
      }

      // too_small
      case z.ZodIssueCode.too_small: {
        if (error.type === "string")
          return {
            message: `${pathStringWithBojosa} ${error.exact ? "" : "최소 "}${
              error.minimum
            }자여야 해요.`,
          };
        return {
          message: `${pathStringWithBojosa} ${error.exact ? "" : "최소 "}${
            error.minimum
          }이어야 해요.`,
        };
      }

      // too_big
      case z.ZodIssueCode.too_big: {
        if (error.type === "string")
          return {
            message: `${pathStringWithBojosa} ${error.exact ? "" : "최대 "}${
              error.maximum
            }자여야 해요.`,
          };
        return {
          message: `${pathStringWithBojosa} ${error.exact ? "" : "최대 "}${
            error.maximum
          }이어야 해요.`,
        };
      }

      // unrecognized_keys
      case z.ZodIssueCode.unrecognized_keys: {
        return { message: `${pathStringWithBojosa} 알 수 없는 값이에요.` };
      }
    }

    return { message: ctx.defaultError };
  });
}
