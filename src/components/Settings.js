import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { Form, Input, InputNumber, Button, Divider, message, Select, Switch, Segmented } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined, MoonOutlined, SunOutlined, ApiOutlined } from '@ant-design/icons';
import { useSettingsStore } from '../store';
import { getColors } from '../theme';

export default function Settings({ onSaved }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [autostart, setAutostartState] = useState(false);
  const [autostartLoading, setAutostartLoading] = useState(false);
  const setStoreSettings = useSettingsStore((s) => s.setSettings);
  const storeSettings = useSettingsStore((s) => s);
  const mode = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const c = getColors(mode);

  useEffect(() => {
    window.electron.getAutostart().then(setAutostartState);
  }, []);

  async function toggleAutostart(checked) {
    setAutostartLoading(true);
    try {
      const result = await window.electron.setAutostart(checked);
      setAutostartState(result.enabled);
    } finally {
      setAutostartLoading(false);
    }
  }

  async function changeTheme(value) {
    const result = await window.electron.setTheme(value);
    setTheme(result.theme);
  }

  useEffect(() => {
    form.setFieldsValue({
      mqttHost:     storeSettings.mqttHost,
      mqttPort:     storeSettings.mqttPort,
      mqttWsPort:   storeSettings.mqttWsPort,
      mqttWsPath:   storeSettings.mqttWsPath,
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
      mqttWsPort:   values.mqttWsPort,
      mqttWsPath:   values.mqttWsPath || '/ws',
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

  function testConnection() {
    const { mqttHost, mqttWsPort, mqttWsPath, mqttUsername, mqttPassword } = form.getFieldsValue();

    if (!mqttHost || !mqttWsPort) {
      message.error('Host and WS port are required');
      return;
    }

    // GitHub Pages (https) requires wss to avoid mixed-content blocking. In
    // Electron, window.location.protocol gives no such signal, so fall back
    // to the port: 443/8884 are the conventional secure-websocket ports
    // (e.g. a Cloudflare-fronted broker).
    const securePorts = [443, 8884];
    const scheme = (window.location.protocol === 'https:' || securePorts.includes(Number(mqttWsPort)))
      ? 'wss' : 'ws';
    const path = (mqttWsPath || '/').trim();
    const url = `${scheme}://${mqttHost}:${mqttWsPort}${path.startsWith('/') ? path : `/${path}`}`;

    setTesting(true);
    const opts = { connectTimeout: 5000, reconnectPeriod: 0 };
    if (mqttUsername) {
      opts.username = mqttUsername;
      opts.password = mqttPassword || '';
    }

    const client = mqtt.connect(url, opts);
    let done = false;

    const timer = setTimeout(() => finish(false, 'Timed out waiting for broker'), 6000);

    function finish(ok, detail) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      client.end(true);
      setTesting(false);
      if (ok) message.success(`Connected via ${url}`);
      else message.error(detail || 'Connection failed');
    }

    client.on('connect', () => finish(true));
    client.on('error', (err) => finish(false, err.message));
  }

  const labelStyle = { color: c.textSecondary, fontSize: 12 };
  const inputStyle = { background: c.inputBg, color: c.textBody, borderColor: c.border };
  const inputAltStyle = { background: c.inputBgAlt, color: c.textBody, borderColor: c.border };

  const sectionHeader = (text) => (
    <div style={{ fontSize: 10, color: c.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
      {text}
    </div>
  );

  return (
    <div style={{ padding: '16px 20px', overflowY: 'auto', height: '100%' }}>

      {sectionHeader('Application')}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: c.textBody }}>Theme</span>
        <Segmented
          size="small"
          value={mode}
          onChange={changeTheme}
          options={[
            { label: 'Dark',  value: 'dark',  icon: <MoonOutlined /> },
            { label: 'Light', value: 'light', icon: <SunOutlined /> },
          ]}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: c.textBody }}>Start automatically when you log in</span>
        <Switch checked={autostart} loading={autostartLoading} onChange={toggleAutostart} size="small" />
      </div>
      <Divider style={{ borderColor: c.borderSubtle, margin: '4px 0 16px' }} />

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
              style={inputStyle}
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
              style={{ width: '100%', ...inputStyle }}
            />
          </Form.Item>
          <Form.Item
            label={<span style={labelStyle}>WS Port</span>}
            name="mqttWsPort"
            rules={[{ required: true }]}
            style={{ width: 80 }}
          >
            <InputNumber
              min={1} max={65535}
              style={{ width: '100%', ...inputStyle }}
            />
          </Form.Item>
          <Form.Item
            label={<span style={labelStyle}>WS Path</span>}
            name="mqttWsPath"
            style={{ width: 70 }}
          >
            <Input
              placeholder="/ws"
              style={inputStyle}
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
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            label={<span style={labelStyle}>Password</span>}
            name="mqttPassword"
            style={{ flex: 1 }}
          >
            <Input.Password
              placeholder="(none)"
              style={inputStyle}
            />
          </Form.Item>
        </div>

        <Divider style={{ borderColor: c.borderSubtle, margin: '4px 0 16px' }} />

        {/* Sources */}
        {sectionHeader('Sources')}
        <div style={{ fontSize: 11, color: c.textTertiary, marginBottom: 12 }}>
          Each source key is <code style={{ background: c.codeBg, padding: '0 4px', borderRadius: 3, color: c.textSecondary }}>projectId/systemId</code>.
          Subscribes to <code style={{ background: c.codeBg, padding: '0 4px', borderRadius: 3, color: c.textSecondary }}>.../status</code> and <code style={{ background: c.codeBg, padding: '0 4px', borderRadius: 3, color: c.textSecondary }}>.../checks/+</code>.
        </div>

        <Form.List
          name="sources"
          rules={[
            {
              validator: async (_, sources) => {
                const hasSource = (sources || []).some((s) => s?.sourceKey?.trim());
                if (!hasSource) {
                  return Promise.reject(new Error('Add at least one Process Status or Connection Status source'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name }) => (
                <div key={key} style={{
                  background: c.panelBg, borderRadius: 6, border: `1px solid ${c.borderSubtle}`,
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
                        style={inputAltStyle}
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
                        style={{ ...inputAltStyle, fontFamily: 'monospace', fontSize: 11 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'type']}
                      label={<span style={labelStyle}>Type</span>}
                      initialValue="connection_status"
                      style={{ width: 140, marginBottom: 8 }}
                    >
                      <Select
                        style={{ background: c.inputBgAlt }}
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
                      style={{ color: c.textTertiary, marginTop: 20 }}
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
                style={{ borderColor: c.border, color: c.textSecondary, background: 'transparent', marginBottom: 8 }}
              >
                Add Source
              </Button>
              <Form.ErrorList errors={errors} />
            </>
          )}
        </Form.List>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button
            icon={<ApiOutlined />}
            loading={testing}
            onClick={testConnection}
            style={{ flex: '0 0 auto' }}
          >
            Test Connection
          </Button>
          <Form.Item style={{ marginBottom: 0, flex: 1 }}>
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
        </div>

      </Form>
    </div>
  );
}
