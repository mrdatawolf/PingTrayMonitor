import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Divider, message, Select } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSettingsStore } from '../store';

export default function Settings({ onSaved }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const setStoreSettings = useSettingsStore((s) => s.setSettings);
  const storeSettings = useSettingsStore((s) => s);

  useEffect(() => {
    form.setFieldsValue({
      mqttHost:     storeSettings.mqttHost,
      mqttPort:     storeSettings.mqttPort,
      mqttUsername: storeSettings.mqttUsername,
      mqttPassword: storeSettings.mqttPassword,
      sources: (storeSettings.sources || []).map((s) => ({
        label:     s.label,
        sourceKey: `${s.projectId}/${s.systemId}`,
        type:      s.type || 'connection_status',
      })),
    });
  }, [storeSettings.mqttHost]);

  async function save(values) {
    const sources = (values.sources || [])
      .filter((s) => s.sourceKey?.trim())
      .map((s, i) => {
        const parts = s.sourceKey.trim().split('/');
        return {
          id:        `source_${Date.now()}_${i}`,
          projectId: parts[0]?.trim() || '',
          systemId:  parts[1]?.trim() || '',
          label:     s.label?.trim() || `Source ${i + 1}`,
          type:      s.type || 'connection_status',
        };
      });

    const newSettings = {
      mqttHost:     values.mqttHost,
      mqttPort:     values.mqttPort,
      mqttUsername: values.mqttUsername || '',
      mqttPassword: values.mqttPassword || '',
      sources,
    };

    setSaving(true);
    try {
      const result = await window.electron.saveSettings(newSettings);
      if (result.ok) {
        setStoreSettings(newSettings);
        onSaved?.();
      } else {
        message.error(result.error || 'Failed to save');
      }
    } finally {
      setSaving(false);
    }
  }

  const labelStyle = { color: '#8c8c8c', fontSize: 12 };

  const sectionHeader = (text) => (
    <div style={{ fontSize: 10, color: '#595959', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
      {text}
    </div>
  );

  return (
    <div style={{ padding: '16px 20px', overflowY: 'auto', height: '100%' }}>

      <Form form={form} layout="vertical" onFinish={save} size="small">

        {/* Broker */}
        {sectionHeader('MQTT Broker')}

        <div style={{ display: 'flex', gap: 8 }}>
          <Form.Item
            label={<span style={labelStyle}>Host</span>}
            name="mqttHost"
            rules={[{ required: true, message: 'Required' }]}
            style={{ flex: 1 }}
          >
            <Input
              placeholder="192.168.1.100"
              style={{ background: '#1a1a1a', color: '#d9d9d9', borderColor: '#3a3a3a' }}
            />
          </Form.Item>
          <Form.Item
            label={<span style={labelStyle}>Port</span>}
            name="mqttPort"
            rules={[{ required: true }]}
            style={{ width: 80 }}
          >
            <InputNumber
              min={1} max={65535}
              style={{ width: '100%', background: '#1a1a1a', borderColor: '#3a3a3a' }}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Form.Item
            label={<span style={labelStyle}>Username</span>}
            name="mqttUsername"
            style={{ flex: 1 }}
          >
            <Input
              placeholder="(none)"
              style={{ background: '#1a1a1a', color: '#d9d9d9', borderColor: '#3a3a3a' }}
            />
          </Form.Item>
          <Form.Item
            label={<span style={labelStyle}>Password</span>}
            name="mqttPassword"
            style={{ flex: 1 }}
          >
            <Input.Password
              placeholder="(none)"
              style={{ background: '#1a1a1a', color: '#d9d9d9', borderColor: '#3a3a3a' }}
            />
          </Form.Item>
        </div>

        <Divider style={{ borderColor: '#2a2a2a', margin: '4px 0 16px' }} />

        {/* Sources */}
        {sectionHeader('Sources')}
        <div style={{ fontSize: 11, color: '#595959', marginBottom: 12 }}>
          Each source key is <code style={{ background: '#1f1f1f', padding: '0 4px', borderRadius: 3, color: '#8c8c8c' }}>projectId/systemId</code>.
          Subscribes to <code style={{ background: '#1f1f1f', padding: '0 4px', borderRadius: 3, color: '#8c8c8c' }}>.../status</code> and <code style={{ background: '#1f1f1f', padding: '0 4px', borderRadius: 3, color: '#8c8c8c' }}>.../checks/+</code>.
        </div>

        <Form.List name="sources">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div key={key} style={{
                  background: '#1a1a1a', borderRadius: 6, border: '1px solid #2a2a2a',
                  padding: '10px 12px 4px', marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Form.Item
                      name={[name, 'label']}
                      label={<span style={labelStyle}>Label</span>}
                      style={{ flex: '0 0 110px', marginBottom: 8 }}
                    >
                      <Input
                        placeholder="Server 1"
                        style={{ background: '#141414', color: '#d9d9d9', borderColor: '#3a3a3a' }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'sourceKey']}
                      label={<span style={labelStyle}>Source key (projectId/systemId)</span>}
                      rules={[
                        { required: true, message: 'Required' },
                        { pattern: /^[^/]+\/[^/]+$/, message: 'Must be projectId/systemId' },
                      ]}
                      style={{ flex: 1, marginBottom: 8 }}
                    >
                      <Input
                        placeholder="xxxxxxxx-xxxx/yyyyyyyy-yyyy"
                        style={{ background: '#141414', color: '#d9d9d9', borderColor: '#3a3a3a', fontFamily: 'monospace', fontSize: 11 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'type']}
                      label={<span style={labelStyle}>Type</span>}
                      initialValue="connection_status"
                      style={{ width: 140, marginBottom: 8 }}
                    >
                      <Select
                        style={{ background: '#141414' }}
                        options={[
                          { value: 'connection_status', label: 'Connection' },
                          { value: 'process_status',    label: 'Process' },
                        ]}
                      />
                    </Form.Item>
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                      style={{ color: '#595959', marginTop: 20 }}
                      size="small"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => add({ label: '', sourceKey: '' })}
                icon={<PlusOutlined />}
                block
                style={{ borderColor: '#3a3a3a', color: '#8c8c8c', background: 'transparent', marginBottom: 16 }}
              >
                Add Source
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving}
            block
          >
            Save & Reconnect
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
}
