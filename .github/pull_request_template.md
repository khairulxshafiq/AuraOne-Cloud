## Ringkasan Perubahan (Summary of Changes)

<!-- Terangkan secara ringkas apa yang dilakukan oleh PR ini, rasional arkitektur, dan objektif fasa -->

## Fasa Berkaitan (Phase / Area)

- [ ] Phase 0: Audit & Baseline
- [ ] Phase 1A: Security Containment
- [ ] Phase 1B: DevOps & Quality Foundation
- [ ] Phase 2: Design System & App Shell
- [ ] Phase 3: Landing Page & Public Presence
- [ ] Lain-lain: <!-- Nyatakan -->

## Perubahan Fail Utama (Key Files Changed)

- `...`

## Senarai Semak Kualiti & DoD (Quality Gate Checklist)

Sebelum memohon semakan, pastikan semua kotak di bawah telah disahkan:

- [ ] **Format (Prettier):** Kod telah diformat (`npm run format:check` lulus tanpa amaran).
- [ ] **Lint (ESLint):** `npm run lint` melepasi sifar ralat dan sifar amaran.
- [ ] **Typecheck (TypeScript):** `npm run typecheck` melepasi sifar ralat.
- [ ] **Ujian & Liputan (Vitest):** `npm run test:coverage` lulus 100%.
- [ ] **Binaan Pengeluaran (Next.js):** `npm run build` berjaya dikompilasi.
- [ ] **Penyemakan Rahsia (Secrets Check):** Tiada API key, token sesi, fail `.env`, atau kata laluan di-commit.
- [ ] **Bahasa Melayu Pertama:** Teks antaramuka dan mesej ralat mesra pengguna dalam BM.
- [ ] **Kepatuhan ADR:** Perubahan mematuhi semua ADR yang telah dipersetujui.

## Bukti Pengesahan Tempatan (Verification Evidence)

```bash
# Tampal output ringkas 'npm run check' di sini
```

## Pelan Pengunduran (Rollback Plan)

<!-- Terangkan langkah-langkah untuk revert sekiranya berlaku isu tidak dijangka dalam pengeluaran -->
