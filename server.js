import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const __dirname = path.resolve();
const dataFilePath = path.join(__dirname, 'js//data', 'graphData.js');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // 클라이언트 파일 제공

// 데이터 파일을 동적으로 불러오기 위한 함수 (캐시 제거)
function loadGraphData() {
  delete require.cache[require.resolve('.js/data/graphData.js')];
  return require('./js/data/graphData.js');
}

// JS 파일 형식으로 저장하기 위한 함수
function saveGraphData(graphData, callback) {
  const fileContent = `
/* 자동 생성된 데이터 파일 */
export const mainGraphData = ${JSON.stringify(graphData.mainGraphData, null, 2)};

export const subGraphData = ${JSON.stringify(graphData.subGraphData, null, 2)};

export const nodeDocuments = ${JSON.stringify(graphData.nodeDocuments, null, 2)};
`;
  fs.writeFile(dataFilePath, fileContent, err => {
    callback(err);
  });
}

// 전체 그래프 데이터 불러오기 (모듈 캐시를 고려)
app.get('/api/graph', (req, res) => {
  try {
    const graphData = loadGraphData();
    res.json({
      mainGraphData: graphData.mainGraphData,
      subGraphData: graphData.subGraphData,
      nodeDocuments: graphData.nodeDocuments
    });
  } catch (err) {
    console.error('데이터 파일 불러오기 실패:', err);
    res.status(500).send('데이터 파일 불러오기 실패');
  }
});

// 특정 노드의 문서를 저장하기 위한 API (PUT)
app.put('/api/node/:id', (req, res) => {
  const nodeId = req.params.id;
  const { document } = req.body;
  
  try {
    const graphData = loadGraphData();
    graphData.nodeDocuments = graphData.nodeDocuments || {};
    graphData.nodeDocuments[nodeId] = document;
    
    saveGraphData(graphData, (err) => {
      if (err) {
        console.error('데이터 파일 쓰기 실패:', err);
        return res.status(500).send('데이터 파일 쓰기 실패');
      }
      res.json({ success: true });
    });
  } catch (err) {
    console.error('Error 처리 중:', err);
    res.status(500).send('서버 오류 발생');
  }
});

// 노드의 문서를 가져오기 위한 API (GET)
app.get('/api/node/:id', (req, res) => {
  const nodeId = req.params.id;
  try {
    const graphData = loadGraphData();
    const doc = (graphData.nodeDocuments && graphData.nodeDocuments[nodeId]) || "";
    res.json({ document: doc });
  } catch (err) {
    console.error('데이터 파일 불러오기 실패:', err);
    res.status(500).send('데이터 파일 불러오기 실패');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 작동 중입니다.`);
});
