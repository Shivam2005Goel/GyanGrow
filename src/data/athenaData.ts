export const traditionalMLData = [
    { model: 'SVM', accuracy: 0.2700, precision: 0.2718, recall: 0.2700, f1: 0.2610 },
    { model: 'KNN', accuracy: 0.2600, precision: 0.2724, recall: 0.2600, f1: 0.2586 },
    { model: 'Decision Tree', accuracy: 0.2550, precision: 0.2597, recall: 0.2550, f1: 0.2561 },
    { model: 'MLP', accuracy: 0.2400, precision: 0.2461, recall: 0.2400, f1: 0.2405 },
    { model: 'Logistic Regression', accuracy: 0.2250, precision: 0.2359, recall: 0.2250, f1: 0.2244 },
    { model: 'Naive Bayes', accuracy: 0.2150, precision: 0.2224, recall: 0.2150, f1: 0.2165 },
    { model: 'Random Forest', accuracy: 0.2150, precision: 0.2141, recall: 0.2150, f1: 0.2093 },
];

export const multiDatasetData = [
    { dataset: 'Adaptive Blended Teaching', LR: 1.0000, RF: 0.9250, SVM: 0.8750, XGBoost: 0.9250 },
    { dataset: 'Adaptive Learning', LR: 0.9837, RF: 1.0000, SVM: 0.9675, XGBoost: 0.9964 },
    { dataset: 'Learning Path', LR: 0.1000, RF: 0.1400, SVM: 0.1150, XGBoost: 0.1500 },
    { dataset: 'Personalized Learning', LR: 0.9500, RF: 1.0000, SVM: 0.9200, XGBoost: 1.0000 },
    { dataset: 'Student Education', LR: 0.9750, RF: 1.0000, SVM: 0.9300, XGBoost: 1.0000 },
];

export const deepLearningStandard = [
    { dataset: 'Adaptive Blended Teaching', bestModel: 'LSTM', accuracy: 1.00, f1: 1.0000, status: 'Perfect' },
    { dataset: 'Adaptive Learning Personalization', bestModel: 'LSTM', accuracy: 0.9928, f1: 0.9928, status: 'Near-Perfect' },
    { dataset: 'Personalized Educational', bestModel: 'GRU', accuracy: 0.9650, f1: 0.9649, status: 'Excellent' },
    { dataset: 'Personalized Learning Interaction', bestModel: 'GRU', accuracy: 0.9300, f1: 0.9304, status: 'Excellent' },
    { dataset: 'Personalized Learning Path', bestModel: 'None', accuracy: 0.0650, f1: 0.0400, status: 'Failure' },
];

export const deepLearningGloVe = [
    { dataset: 'Adaptive Blended Teaching', LSTM: 0.80, GRU: 0.825, impact: -0.175, impactLabel: 'Negative (−17.5% vs pure LSTM)' },
    { dataset: 'Adaptive Learning Personalization', LSTM: 0.9964, GRU: 0.9964, impact: 0.0036, impactLabel: 'Slight positive' },
    { dataset: 'Personalized Educational', LSTM: 0.95, GRU: 0.97, impact: 0.005, impactLabel: 'Slight positive (+0.5%)' },
    { dataset: 'Personalized Learning Interaction', LSTM: 0.93, GRU: 0.97, impact: 0.04, impactLabel: 'Significant positive (+4%)' },
    { dataset: 'Personalized Learning Path', LSTM: 0.095, GRU: 0.08, impact: 0.03, impactLabel: 'Still failure' },
];

export const bertResults = [
    { dataset: 'Adaptive Learning', target: 'Learning Outcome (0/1)', classes: 2, accuracy: 0.9259, loss: 0.35, status: 'Excellent' },
    { dataset: 'Adaptive Blended Teaching', target: 'Predicted Performance', classes: 3, accuracy: 0.8750, loss: 0.67, status: 'High' },
    { dataset: 'Personalized Learning', target: 'Learning Outcome (0–2)', classes: 3, accuracy: 0.4800, loss: 1.06, status: 'Moderate' },
    { dataset: 'Student Education', target: 'Student Performance', classes: 3, accuracy: 0.3750, loss: 1.05, status: 'Low' },
    { dataset: 'Learning Path', target: 'Next Course Rec.', classes: 12, accuracy: 0.0650, loss: 2.50, status: 'Critical Failure' },
];

export const slmFineTuning = {
    model: 'Qwen 2.5 (1.5B)',
    parametersTuned: '~18.4M (1.18% of total)',
    quantization: '4-bit NF4',
    trainingCorpus: '5,461 semantic conversations',
    initialLoss: 2.5591,
    finalLoss: 1.0571,
    deployment: 'GGFU (edge devices)'
};

export const keyFindings = [
    { title: 'Best Architecture', detail: 'LSTM/GRU Deep Learning models consistently outperform traditional ML.', icon: 'Zap' },
    { title: 'Top Datasets', detail: 'Adaptive Learning & Blended Teaching provide the most reliable signals.', icon: 'CheckCircle' },
    { title: 'Failure Mode', detail: 'Personalized Learning Path (synthetic noise suspected) remains unsolved.', icon: 'AlertTriangle' },
    { title: 'GloVe Utility', detail: 'Helps with text-heavy data but hurts numerical grading tasks (-17.5%).', icon: 'Globe' },
    { title: 'BERT Use Case', detail: 'Best for low-cardinality classification with descriptive features.', icon: 'Brain' },
];
