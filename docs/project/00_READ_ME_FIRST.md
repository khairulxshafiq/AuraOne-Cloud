# 00 — Read Me First

# AuraOne Cloud Documentation Pack

Version: 1.0  
Status: Pre-Audit Planning  
Document owner: [ISI NAMA PEMILIK]  
Last updated: [ISI TARIKH]

---

## Tujuan Folder Ini

Folder ini ialah sumber rujukan utama bagi pembangunan AuraOne Cloud.

Dokumen ini disediakan supaya:

- Founder boleh menetapkan hala tuju produk dengan jelas.
- Antigravity boleh mengaudit sistem sebelum menulis kod.
- AI agent baharu boleh memahami projek tanpa meneka.
- Developer dan DevOps boleh mengubah sistem dengan selamat.
- Keputusan seni bina mempunyai justifikasi.
- Pembangunan boleh dilakukan secara berfasa.
- Audit keselamatan dan teknikal menjadi lebih mudah.
- Migrasi daripada prototaip kepada Supabase boleh dirancang.
- Scope creep dan refactor yang tidak perlu dapat dielakkan.

Dokumen ini tidak menggantikan source code, migrations, tests atau runbook operasi.

---

## Urutan Bacaan Wajib

Semua AI agent, developer, DevOps engineer dan auditor mesti membaca fail dalam urutan berikut:

1. `00_READ_ME_FIRST.md`
2. `01_AURAONE_PROJECT_INPUT.md`
3. `02_AURAONE_ENDSTATE_VISION.md`
4. `03_AURAONE_BRAND_VOICE.md`
5. `04_AURAONE_MASTER_BLUEPRINT.md`
6. `05_AURAONE_PHASE_PLAN.md`
7. `06_AURAONE_DECISIONS_LOG.md`
8. `07_AURAONE_EXECUTION_GUIDE.md`
9. `08_AURAONE_DEFINITION_OF_DONE.md`

Selepas itu, baca:

1. `README.md` repository
2. `CONTRIBUTING.md`
3. Dokumen architecture
4. Architecture Decision Records
5. Risk register
6. Feature README yang berkaitan
7. Deployment dan operations runbook

---

## Dokumen Yang Perlu Diisi Founder

Founder perlu melengkapkan:

`01_AURAONE_PROJECT_INPUT.md`

Jangan membuat andaian terhadap maklumat yang masih ditandakan:

`[ISI]`

Sekiranya sesuatu keputusan belum dibuat, gunakan:

`[BELUM DIPUTUSKAN]`

Sekiranya sesuatu perkara tidak berkaitan, gunakan:

`[TIDAK BERKENAAN]`

Jangan mengisi maklumat sensitif seperti:

- Kata laluan
- Production API key
- Supabase service-role key
- Telegram bot token
- Billplz secret
- Payment credential
- Private signing key
- Database password
- Recovery code

Gunakan nama environment variable atau lokasi secret manager sahaja.

Contoh:

```text
Telegram Token:
Disimpan sebagai TELEGRAM_BOT_TOKEN dalam secret manager.
```

---

## Status Autoriti Dokumen

Jika berlaku percanggahan, gunakan keutamaan berikut:

1. Keputusan terbaharu yang berstatus `Accepted` dalam Decisions Log
2. Project Input yang disahkan founder
3. End-State Vision
4. Master Blueprint
5. Phase Plan
6. Implementasi semasa

Jika source code bercanggah dengan keputusan produk, jangan ubah secara senyap.

Buka finding atau Architecture Decision Record dahulu.

---

## Peraturan Perubahan

Setiap perubahan penting mesti menyatakan:

- Apa yang berubah
- Mengapa ia berubah
- Fail yang terjejas
- Risiko
- Impak migrasi
- Impak keselamatan
- Impak UX
- Cara menguji
- Cara rollback
- Keputusan founder jika diperlukan

---

## Prinsip Pelaksanaan

AuraOne mesti dibangunkan dengan aliran:

```text
Discover
↓
Audit
↓
Decide
↓
Design
↓
Implement
↓
Test
↓
Document
↓
Review
↓
Release
```

Jangan gunakan aliran:

```text
Terus bina semua feature
↓
Baiki architecture kemudian
```

---

## Arahan Permulaan Kepada Antigravity

Gunakan arahan berikut:

```text
Baca semua dokumen di dalam /docs/project mengikut urutan yang
ditetapkan dalam 00_READ_ME_FIRST.md.

Jangan ubah source code terlebih dahulu.

Mulakan Phase 0A sahaja: Read-Only Discovery.

Audit keadaan semasa AuraOne dan semua integrasi Hermes yang berkaitan.

Jangan memulakan Phase 0B, Phase 0C atau implementasi feature secara
automatik.

Pada akhir Phase 0A:
1. Hasilkan report yang diwajibkan.
2. Senaraikan fakta, andaian dan perkara yang masih tidak diketahui.
3. Jalankan quality gate.
4. Berikan status PASS atau FAIL.
5. Berhenti dan tunggu arahan founder.
```

---

## Hasil Akhir Yang Dikehendaki

Developer atau AI agent baharu sepatutnya dapat memahami perkara berikut tanpa meneka:

- Apa itu AuraOne
- Siapa pengguna sasaran
- Bagaimana pengalaman pengguna perlu dirasakan
- Apakah identiti visual AuraOne
- Bagaimana Aura bercakap
- Apakah capability Hermes
- Apakah perbezaan Free, Trial Pro, Pro dan Empire
- Bagaimana codebase distrukturkan
- Bagaimana keselamatan dikendalikan
- Bagaimana module diuji
- Bagaimana perubahan dibuat
- Bagaimana sistem dimigrasikan
- Bagaimana deployment dan rollback dijalankan

