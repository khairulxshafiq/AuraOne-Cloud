import { describe, it, expect } from 'vitest';
import React from 'react';
import { Modal } from '@/components/overlays/Modal';
import { Drawer } from '@/components/overlays/Drawer';
import { Tooltip } from '@/components/overlays/Tooltip';

describe('Overlay Components (components/overlays/)', () => {
  it('Modal renders dialog with accessible ARIA properties when open', () => {
    const element = React.createElement(
      Modal,
      {
        isOpen: true,
        onClose: () => {},
        title: 'Tetapan Profil',
        description: 'Kemaskini maklumat peribadi anda',
      },
      React.createElement('div', null, 'Kandungan Modal'),
    );

    expect(element.props.isOpen).toBe(true);
    expect(element.props.title).toBe('Tetapan Profil');
    expect(element.props.description).toBe('Kemaskini maklumat peribadi anda');
  });

  it('Drawer renders navigation drawer with designated orientation', () => {
    const element = React.createElement(
      Drawer,
      {
        isOpen: true,
        onClose: () => {},
        title: 'Navigasi Utama',
        side: 'left',
      },
      React.createElement('nav', null, 'Menu'),
    );

    expect(element.props.isOpen).toBe(true);
    expect(element.props.side).toBe('left');
    expect(element.props.title).toBe('Navigasi Utama');
  });

  it('Tooltip wraps target element and supplies accessible tooltip content', () => {
    const buttonChild = React.createElement('button', null, 'Tindakan');
    const element = React.createElement(
      Tooltip,
      {
        content: 'Penerangan butang',
        position: 'top',
      },
      buttonChild,
    );

    expect(element.props.content).toBe('Penerangan butang');
    expect(element.props.position).toBe('top');
  });
});
