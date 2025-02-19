export const mainGraphData = {
    nodes: [
      { id: 1, label: "고혈압", category: "disease" },
      { id: 2, label: "당뇨병", category: "disease" },
      { id: 3, label: "고지혈증", category: "disease" },
      { id: 4, label: "심부전", category: "disease" },
      { id: 5, label: "심근경색", category: "disease" },
      { id: 6, label: "뇌졸중", category: "disease" },
      { id: 7, label: "폐렴", category: "disease" }
    ],
    edges: [
      // 대사 증후군 및 관련 합병증
      { from: 1, to: 5 }, // 고혈압 → 심근경색
      { from: 2, to: 5 }, // 당뇨병 → 심근경색
      { from: 3, to: 5 }, // 고지혈증 → 심근경색
      { from: 1, to: 6 }, // 고혈압 → 뇌졸중
      { from: 2, to: 6 }, // 당뇨병 → 뇌졸중
      { from: 3, to: 6 }, // 고지혈증 → 뇌졸중
      { from: 1, to: 4 }, // 고혈압 → 심부전
      { from: 5, to: 4 }, // 심근경색 → 심부전
      { from: 2, to: 7 }  // 당뇨병 → 폐렴 (당뇨 환자는 폐렴에 취약)
    ]
  };
  
  export const subGraphData = {
    // 고혈압 관련 치료/술기
    1: {
      nodes: [
        { id: 'hp1', label: "ACE inhibitor 투여", category: "therapy" },
        { id: 'hp2', label: "칼슘 채널 차단제", category: "therapy" },
        { id: 'hp3', label: "이뇨제 투여", category: "therapy" },
        { id: 'hp4', label: "생활습관 개선", category: "therapy" }
      ],
      edges: [
        { from: 'hp1', to: 'hp2' },
        { from: 'hp2', to: 'hp3' },
        { from: 'hp3', to: 'hp4' }
      ]
    },
    // 당뇨병 관련 치료/술기
    2: {
      nodes: [
        { id: 'db1', label: "인슐린 주사", category: "therapy" },
        { id: 'db2', label: "경구 혈당강하제", category: "therapy" },
        { id: 'db3', label: "식이조절", category: "therapy" },
        { id: 'db4', label: "운동 요법", category: "therapy" }
      ],
      edges: [
        { from: 'db1', to: 'db2' },
        { from: 'db2', to: 'db3' },
        { from: 'db3', to: 'db4' }
      ]
    },
    // 고지혈증 관련 치료/술기
    3: {
      nodes: [
        { id: 'hl1', label: "스타틴 요법", category: "therapy" },
        { id: 'hl2', label: "식이요법", category: "therapy" },
        { id: 'hl3', label: "지질저하제 투여", category: "therapy" }
      ],
      edges: [
        { from: 'hl1', to: 'hl2' },
        { from: 'hl2', to: 'hl3' }
      ]
    },
    // 심부전 관련 치료/술기
    4: {
      nodes: [
        { id: 'hf1', label: "베타 차단제", category: "therapy" },
        { id: 'hf2', label: "ACE inhibitor", category: "therapy" },
        { id: 'hf3', label: "이뇨제 투여", category: "therapy" },
        { id: 'hf4', label: "심장 재동기화 치료", category: "therapy" }
      ],
      edges: [
        { from: 'hf1', to: 'hf2' },
        { from: 'hf2', to: 'hf3' },
        { from: 'hf3', to: 'hf4' }
      ]
    },
    // 심근경색 관련 치료/술기
    5: {
      nodes: [
        { id: 'mi1', label: "관상동맥 중재술(PCI)", category: "therapy" },
        { id: 'mi2', label: "스텐트 삽입", category: "therapy" },
        { id: 'mi3', label: "항혈소판 요법", category: "therapy" }
      ],
      edges: [
        { from: 'mi1', to: 'mi2' },
        { from: 'mi2', to: 'mi3' }
      ]
    },
    // 뇌졸중 관련 치료/술기
    6: {
      nodes: [
        { id: 'st1', label: "혈전 용해제 투여", category: "therapy" },
        { id: 'st2', label: "뇌혈관 재개통술", category: "therapy" },
        { id: 'st3', label: "재활 치료", category: "therapy" }
      ],
      edges: [
        { from: 'st1', to: 'st2' },
        { from: 'st2', to: 'st3' }
      ]
    },
    // 폐렴 관련 치료/술기
    7: {
      nodes: [
        { id: 'pn1', label: "항생제 치료", category: "therapy" },
        { id: 'pn2', label: "산소 공급", category: "therapy" },
        { id: 'pn3', label: "기침 억제제 사용", category: "therapy" }
      ],
      edges: [
        { from: 'pn1', to: 'pn2' },
        { from: 'pn2', to: 'pn3' }
      ]
    }
  };

  export const nodeDocuments = {
    "1": "<p>고혈압에 대한 노트 내용...</p>",
    "2": "<p>당뇨병에 대한 노트 내용...</p>"
  };