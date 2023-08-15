export const createSurveyJson = {
  title: '너는 뭘 좋아해?',
  description: '좋아하는 것에 대한 설문 조사입니다.',
  max_participants: 100,
  questions: [
    {
      title: '가장 좋아하는 색깔은?',
      order: 1,
      choices: [
        {
          content: '빨강',
          order: 1,
        },
        {
          content: '파랑',
          order: 2,
        },
        {
          content: '노랑',
          order: 3,
        },
        {
          content: '주황',
          order: 4,
        },
      ],
    },
    {
      title: '가장 좋아하는 음식은?',
      order: 2,
      choices: [
        {
          content: '피자',
          order: 1,
        },
        {
          content: '치킨',
          order: 2,
        },
        {
          content: '잔치국수',
          order: 3,
        },
        {
          content: '오삼불고기',
          order: 4,
        },
      ],
    },
    {
      title: '흡연 중이십니까?',
      order: 3,
      choices: [
        {
          content: '예',
          order: 1,
        },
        {
          content: '아니오',
          order: 2,
        },
      ],
    },
    {
      title: '어느 정도 피시나요?',
      order: 4,
      choices: [
        {
          content: '하루 한 갑',
          order: 1,
        },
        {
          content: '일주일 한 갑',
          order: 2,
        },
        {
          content: '한 달 한 갑',
          order: 3,
        },
      ],
    },
    {
      title: '운동하나요?',
      order: 5,
      choices: [
        {
          content: '예',
          order: 1,
        },
        {
          content: '아니오',
          order: 2,
        },
      ],
    },
    {
      title: '얼마나 자주하나요?',
      order: 6,
      choices: [
        {
          content: '일주일 1회',
          order: 1,
        },
        {
          content: '일주일 2회',
          order: 2,
        },
        {
          content: '일주일 3회',
          order: 3,
        },
      ],
    },
    {
      title: '몸 상태가 어떤가요?',
      order: 7,
      choices: [
        {
          content: '안좋음',
          order: 1,
        },
        {
          content: '보통',
          order: 2,
        },
        {
          content: '좋음',
          order: 3,
        },
        {
          content: '매우 좋음',
          order: 4,
        },
      ],
    },
  ],
  conditional_choice: [
    {
      target_question: 3,
      specific_choice: 2,
      next_question: 5,
    },
    {
      target_question: 5,
      specific_choice: 2,
      next_question: 7,
    },
  ],
};
