'use client';

import { ScriptExecutionService } from '@/core/services/script-execution.service';
import { ClearOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { Alert, Button, Card, message, Space, Table, theme, Typography } from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;

export const ScriptExecutionComponent = () => {
    const [script, setScript] = useState<string>('-- Write your SQL script here\nSELECT * FROM Users');
    const [loading, setLoading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { token } = theme.useToken();
    const scriptExecutionService = new ScriptExecutionService();

    const handleExecute = async () => {
        if (!script.trim()) {
            message.warning('Vui lòng nhập script để thực thi.');
            return;
        }

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const encodedScript = window.btoa(unescape(encodeURIComponent(script)));

            scriptExecutionService.execute({
                payload: { script: encodedScript },
                onSuccess: (res) => {
                    if (res?.isSuccess === false) {
                        const errorMessage = res.message || 'Thực thi script thất bại';
                        message.error(errorMessage);
                        setError(errorMessage);
                        setResult(null);
                    } else {
                        message.success('Thực thi script thành công!');
                        setResult(res);
                        setError(null);
                    }
                    setLoading(false);
                },
                onError: (err: unknown) => {
                    console.error(err);
                    const errorMessage = err instanceof Error ? err.message : 'Thực thi script thất bại';
                    message.error(errorMessage);
                    setError(errorMessage);
                    setResult(null);
                    setLoading(false);
                },
            });
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Thực thi script thất bại';
            message.error(errorMessage);
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleClear = () => {
        setScript('');
        setResult(null);
        setError(null);
    };

    const renderResult = () => {
        if (error) {
            return (
                <Alert
                    message={
                        <Text strong style={{ color: token.colorError }}>
                            Lỗi
                        </Text>
                    }
                    description={<Text style={{ color: token.colorError }}>{error}</Text>}
                    type="error"
                    showIcon
                    style={{
                        border: `1px solid ${token.colorError}`,
                        background: token.colorErrorBg,
                    }}
                />
            );
        }

        if (!result) return null;

        // Prioritize data from the response wrapper
        const dataToRender = result.data !== undefined ? result.data : result;

        if (Array.isArray(dataToRender) && dataToRender.length > 0) {
            const columns = Object.keys(dataToRender[0]).map((key) => ({
                title: key,
                dataIndex: key,
                key: key,
                render: (text: unknown) => {
                    if (typeof text === 'object' && text !== null) {
                        return JSON.stringify(text);
                    }
                    return String(text);
                },
            }));

            return (
                <Table
                    dataSource={dataToRender}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                    rowKey={(record, index) => index?.toString() || ''}
                    size="small"
                    bordered
                />
            );
        }

        // If success message exists and no data, show message
        if (result.isSuccess && result.message && !result.data) {
            return <Alert message="Thành công" description={result.message} type="success" showIcon />;
        }

        return (
            <pre
                style={{
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '8px',
                    maxHeight: '400px',
                    overflow: 'auto',
                    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
                    fontSize: '13px',
                    border: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                {JSON.stringify(dataToRender, null, 2)}
            </pre>
        );
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>
                            Thực thi SQL Script
                        </Title>
                        <Text type="secondary">Chạy các script SQL Server một cách an toàn và hiệu quả.</Text>
                    </div>
                    <Space>
                        <Button icon={<ClearOutlined />} onClick={handleClear} disabled={loading}>
                            Làm lại
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={handleExecute}
                            loading={loading}
                            size="large"
                            style={{
                                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                                border: 'none',
                                boxShadow: '0 4px 14px 0 rgba(24, 144, 255, 0.39)',
                            }}
                        >
                            Thực thi
                        </Button>
                    </Space>
                </div>

                <Card
                    variant="borderless"
                    style={{
                        boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}
                    styles={{ body: { padding: 0 } }}
                >
                    <div
                        style={{
                            padding: '16px',
                            background: token.colorFillAlter,
                            borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        }}
                    >
                        <Space>
                            <Text strong>Trình soạn thảo</Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Hãy kiểm tra cú pháp trước khi thực thi.
                            </Text>
                        </Space>
                    </div>
                    <Editor
                        height="400px"
                        defaultLanguage="sql"
                        theme="vs-dark"
                        value={script}
                        onChange={(value) => setScript(value || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                        }}
                    />
                </Card>

                {(result || error) && (
                    <Card
                        title={error ? <Text type="danger">Lỗi thực thi</Text> : 'Kết quả thực thi'}
                        variant="borderless"
                        style={{
                            boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            border: error ? `1px solid ${token.colorError}` : undefined,
                        }}
                    >
                        {renderResult()}
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default ScriptExecutionComponent;
