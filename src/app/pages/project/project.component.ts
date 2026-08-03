import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-project', standalone: true, imports: [RouterLink],
  templateUrl: './project.component.html', styleUrl: './project.component.scss'
})
export class ProjectComponent {
  pipeline = [
    {n:'00',l:'Install Dependencies'},{n:'01',l:'Imports & Setup'},{n:'02',l:'Configuration'},
    {n:'03',l:'Dataset Audit'},{n:'04',l:'Preprocessing & Dataset'},{n:'05',l:'Model Architecture'},
    {n:'06',l:'Training Utilities'},{n:'07',l:'Trainer Engine'},{n:'08',l:'Train: EfficientNet-B4'},
    {n:'09',l:'Train: ResNet-50 + ConvNeXt'},{n:'10',l:'Evaluation'},{n:'11',l:'Baseline Evaluation'},
    {n:'12',l:'Explainability: Grad-CAM'},{n:'13',l:'Training Curves'},{n:'14',l:'Export: TorchScript + ONNX'},
    {n:'15',l:'Clinical Inference Pipeline'},{n:'16',l:'TensorBoard'},{n:'17',l:'Pipeline Summary'},
  ];
  models = [
    {name:'EfficientNet-B4',role:'Primary Model',  acc:'94.75%',color:'#3b8ef0'},
    {name:'ConvNeXt-Tiny',  role:'Best Performer', acc:'95.69%',color:'#22d3ee'},
    {name:'ResNet-50',      role:'Baseline',        acc:'94.13%',color:'#6baef7'},
  ];
  tech = [
    {name:'Python',      icon:'🐍',color:'#eab308'},
    {name:'PyTorch',     icon:'🔥',color:'#ef4444'},
    {name:'MONAI',       icon:'🏥',color:'#22d3ee'},
    {name:'OpenCV',      icon:'👁️',color:'#22c55e'},
    {name:'NumPy',       icon:'📐',color:'#3b8ef0'},
    {name:'Scikit-learn',icon:'⚙️',color:'#a855f7'},
    {name:'Matplotlib',  icon:'📊',color:'#f97316'},
    {name:'timm',        icon:'🧠',color:'#22d3ee'},
  ];
  strengths = [
    {t:'Pipeline Coverage',    d:'End-to-end from raw data to deployment-ready exports'},
    {t:'Explainability',       d:'Grad-CAM, Grad-CAM++, and LayerCAM visualizations'},
    {t:'Production Ready',     d:'ONNX + TorchScript exports with metadata JSON'},
    {t:'Clinical Safety',      d:'Smart warnings on low confidence and ambiguous cases'},
  ];
  features = [
    'Accurate tumor classification into 4 classes','Grad-CAM based explainability',
    'High performance deep learning models','Fast inference and analysis',
    'Support for multiple MRI formats','Easy integration into clinical workflow',
  ];
  exports = [
    {fmt:'ONNX',        file:'efficientnet_b4.onnx',       size:'~67 MB'},
    {fmt:'TorchScript', file:'efficientnet_b4_scripted.pt', size:'~69 MB'},
  ];
}
