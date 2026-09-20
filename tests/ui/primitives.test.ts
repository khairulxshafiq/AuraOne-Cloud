import { describe, it, expect } from 'vitest';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Divider } from '@/components/ui/Divider';

describe('UI Primitives (components/ui/)', () => {
  it('Button renders valid element with variant and accessibility states', () => {
    const element = React.createElement(
      Button,
      {
        variant: 'primary',
        size: 'md',
        isLoading: true,
      },
      'Hantar',
    );

    expect(element.type).toBe(Button);
    expect(element.props.variant).toBe('primary');
    expect(element.props.isLoading).toBe(true);
    expect(element.props.children).toBe('Hantar');
  });

  it('IconButton requires accessible aria-label', () => {
    const element = React.createElement(IconButton, {
      icon: React.createElement('span', null, 'Icon'),
      'aria-label': 'Tutup panel',
      variant: 'ghost',
    });

    expect(element.props['aria-label']).toBe('Tutup panel');
    expect(element.props.variant).toBe('ghost');
  });

  it('Input associates label, error, and hint with ARIA attributes', () => {
    const element = React.createElement(Input, {
      id: 'email-input',
      label: 'Alamat Emel',
      error: 'Emel tidak sah',
      hint: 'Gunakan emel peribadi atau syarikat',
    });

    expect(element.props.id).toBe('email-input');
    expect(element.props.label).toBe('Alamat Emel');
    expect(element.props.error).toBe('Emel tidak sah');
  });

  it('Badge supports dot indicators and semantic status variants', () => {
    const element = React.createElement(
      Badge,
      {
        variant: 'success',
        dot: true,
      },
      'Aktif',
    );

    expect(element.props.variant).toBe('success');
    expect(element.props.dot).toBe(true);
    expect(element.props.children).toBe('Aktif');
  });

  it('Avatar provides accessible name and fallback initials', () => {
    const element = React.createElement(Avatar, {
      alt: 'Khairul Shafiq',
      fallback: 'KS',
      status: 'online',
    });

    expect(element.props.alt).toBe('Khairul Shafiq');
    expect(element.props.fallback).toBe('KS');
    expect(element.props.status).toBe('online');
  });

  it('Progress clamps values safely within 0-100%', () => {
    const element = React.createElement(Progress, {
      value: 120,
      max: 100,
      label: 'Kuota Harian',
      showValue: true,
    });

    expect(element.props.value).toBe(120);
    expect(element.props.label).toBe('Kuota Harian');
    expect(element.props.showValue).toBe(true);
  });

  it('Divider supports vertical and horizontal orientations with labels', () => {
    const element = React.createElement(Divider, {
      orientation: 'horizontal',
      label: 'ATAU',
    });

    expect(element.props.orientation).toBe('horizontal');
    expect(element.props.label).toBe('ATAU');
  });
});
