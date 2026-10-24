# Mantık Devresi Simülatörü

Tarayıcıda çalışan, sürükle-bırak bir mantık kapısı simülatörü. Kapıları tuvale yerleştirip kablolarla bağlıyorsun, girişleri açıp kapatarak çıkışı canlı izliyorsun. p5.js ile yazıldı.

Hatice Reyhan Çalışkan ve Betül Canol, Sayısal Tasarım dersi projesi, Kocaeli Sağlık ve Teknoloji Üniversitesi (Mayıs 2024).

## Desteklenen elemanlar

Input, Output, AND, OR, NOT, NAND, NOR, XOR, XNOR, BUFFER

## Kullanım

- Sağdaki butonlarla eleman ekle, gövdesinden tutup sürükle.
- Bir elemanın çıkış ucundan başka bir elemanın giriş ucuna sürükleyerek kablo çek.
- Input elemanına tıklayınca 0/1 arasında değişir. Output, gelen değere göre renk değiştirir.
- İmleç bir elemanın üzerindeyken:
  - `Delete`: elemanı sil
  - `Ctrl + A`: yeniden adlandır
  - `Ctrl + B`: çıkış bağlantısını kopar
- Çöp kutusu butonu tüm devreyi temizler.
- Adresin sonuna `?full` eklenirse çizim alanı üç kat büyür.

## Çalıştırma

Kurulum yok. `220501001_HaticeReyhanÇalışkan_220501009_BetulCanol/index.html` dosyasını tarayıcıda açmak yeterli. p5.js (v1.9.4) klasörün içinde, internet bağlantısı gerekmiyor.

## Dosyalar

```
220501001_HaticeReyhanÇalışkan_220501009_BetulCanol/
  index.html    sayfa ve eleman butonları
  classes.js    Node sınıfı ve her kapının alt sınıfı
  script.js     fare/klavye olayları, kablolama, devreyi dolaşma (DFS)
  style.css
  p5.min.js
*.pdf           proje raporu
```
