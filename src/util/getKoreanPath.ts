export default function getKoreanPath(path: (string | number)[]) {
  return path.map((key) => {
    if (typeof key === "number") {
      return key;
    }
    switch (key) {
      case "topic":
        return "주제";
      case "query":
        return "검색어";
      case "text":
        return "내용";
      case "username":
        return "사용자 이름";
      case "password":
        return "비밀번호";
      case "photo":
        return "사진";
      case "topicIds":
        return "주제 아이디 목록";
      case "before":
        return "주제 아이디 상한선";
      case "expiresIn":
        return "만료 시간";
      case "photos":
        return "사진 목록";
      case "momentId":
        return "모멘트 아이디";
      case "emoji":
        return "이모지";
      case "start":
        return "모멘트 아이디 시작점";
    }
    return key;
  });
}
