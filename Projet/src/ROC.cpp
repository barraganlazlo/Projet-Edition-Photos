#include <stdio.h>
#include <iostream>
#include "image_ppm.h"
#include <fstream>

using namespace std;
int main(int argc, char* argv[])
{
  char cNomImgLue[250], cNomVerite[250];
  char BufferOut[250];
  int nH, nW, nTaille, seuil;

  if (argc < 4)
  {
    printf("Usage: ImageIn.pgm ImageVerite.pgm ImgOut.dat ... \n");
    exit (1) ;
  }

  sscanf (argv[1],"%s",cNomImgLue);
  sscanf (argv[2],"%s",cNomVerite);
  sscanf (argv[3],"%s",BufferOut);

  OCTET *ImgIn, *ImgVerite;

  lire_nb_lignes_colonnes_image_pgm(cNomImgLue, &nH, &nW);
  nTaille = nH * nW;

  allocation_tableau(ImgIn, OCTET, nTaille);
  allocation_tableau(ImgVerite, OCTET, nTaille);
  lire_image_pgm(cNomImgLue, ImgIn, nTaille);
  lire_image_pgm(cNomVerite, ImgVerite, nTaille);

  ofstream fileOut(BufferOut);

  int temp = 0;

  float distanceMin = -1;
  int sMin = -1;

  float F1_SCORE = 0;
  float m_precision = 0;
  float m_rappel = 0;

  for (int s = 0; s < 256; s++) {
    int TP = 0;
    int FP = 0;
    int TN = 0;
    int FN = 0;

    for (int i=0; i < nH; i++) {
      for (int j=0; j < nW; j++) {
        int pos = i*nW+j;
        temp = ImgIn[pos] > s ? 255 : 0;
        if(ImgVerite[pos] == temp){
          if(ImgVerite[pos] == 255) TP++;
          else TN++;
        }else{
          if(ImgVerite[pos] == 255) FN++;
          else FP++;
        }

      }
    }
    cout << "SEUIL : " << s << endl;
    cout << "TP = " << TP << endl;
    cout << "FP = " << FP << endl;
    cout << "TN = " << TN << endl;
    cout << "FN = " << FN << endl;

    cout << endl;
    float Sensibilite = ((float)TP / (float)(TP + FN)); // Taux de Vrai positifs
    // float Specifite = 1.0 - ((float)TN / (float)(TN + FP)); //
    float TauxFauxPositif = ((float)FP / (float)(FP + TN));

    float precision = ((float)TP / (float)(TP + FP));
    float rappel = ((float)TP / (float)(TP + FN));

    cout << "Sensibilite : " << Sensibilite << endl;
    cout << "Specifite : " << TauxFauxPositif << endl;
    if(TN + FP != 0 && TP + FN != 0){
      fileOut<< TauxFauxPositif <<" "<< Sensibilite <<endl;
      double distance = abs(TauxFauxPositif*TauxFauxPositif - Sensibilite*Sensibilite);
      // cout << "distance : " << distance << endl;
      if(distance > distanceMin || distanceMin == -1){
        distanceMin = distance;
        sMin = s;
        m_precision = precision;
        m_rappel = rappel;
        F1_SCORE = 2*(precision * rappel) / (precision + rappel);
      }
    }
  }

  // cout << "DistanceMin = " << distanceMin << " ; s = " << sMin << endl;
  // cout << "precision = " << m_precision << endl;
  // cout << "rappel = " << m_rappel << endl;
  // cout << "F1 score : " << F1_SCORE << endl;

  // ecrire_image_pgm(cNomImgEcrite, ImgVerite,  nH, nW);
  free(ImgIn);
  return 1;
}
