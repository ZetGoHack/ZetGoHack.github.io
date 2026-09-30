import { useState } from 'preact/hooks';
import { changePassword } from './api';

export default function PasswordTab() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: Event) => {
    e.preventDefault();
    if (next !== repeat) {
      setMessage({ kind: 'error', text: 'Новый пароль и повтор не совпадают.' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await changePassword(current, next);
      setCurrent('');
      setNext('');
      setRepeat('');
      setMessage({ kind: 'ok', text: 'Пароль изменён. Остальные устройства разлогинены.' });
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Не удалось сменить пароль.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form class="panel narrow" onSubmit={submit}>
      <h2>Смена пароля</h2>
      <label class="field">
        <span>Текущий пароль</span>
        <input type="password" autocomplete="current-password" value={current} onInput={(e) => setCurrent(e.currentTarget.value)} required />
      </label>
      <label class="field">
        <span>Новый пароль (минимум 10 символов)</span>
        <input type="password" autocomplete="new-password" minLength={10} value={next} onInput={(e) => setNext(e.currentTarget.value)} required />
      </label>
      <label class="field">
        <span>Новый пароль ещё раз</span>
        <input type="password" autocomplete="new-password" minLength={10} value={repeat} onInput={(e) => setRepeat(e.currentTarget.value)} required />
      </label>
      {message && (
        <p class={message.kind === 'ok' ? 'form-ok' : 'form-error'} role="status">
          {message.text}
        </p>
      )}
      <button type="submit" class="btn btn-primary" disabled={busy}>
        {busy ? 'Сохраняю…' : 'Сменить пароль'}
      </button>
    </form>
  );
}
